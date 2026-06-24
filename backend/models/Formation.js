const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const Schema = mongoose.Schema;
const generateCertificate = require('../utils/generateCertificate'); // adapte le chemin selon ton projet
const Certificate = require('../models/Certificate'); // idem



// Modèle Formation
const schemaFormation = new Schema({
  name: { type: String, required: true },
  description: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  horaire: String,
  formateur: { type: mongoose.Schema.Types.ObjectId, ref: 'Formateur' },
  apprenants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Apprenant' }],
  prix: Number,
  tags: [String],
  likesCount: Number,
  level: { type: String, enum: ['Tous les niveaux', 'Débutant', 'Intermédiaire', 'Confirmé'], required: true },
  image: { name: String, path: String },
  startDate: String,
  endDate: String,

  

});


const Formation = mongoose.model('Formation', schemaFormation);
const Session = require('../models/SessionFormation'); // adapte le chemin selon ton arborescence


// Configurer Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'yasminesoussie71@gmail.com',
    pass: 'szxoefrynrxivtzk',
  },
});

function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}


// Fonction d'envoi d'e-mail
async function sendEmail(formation, isOpened) {
  const Apprenant = mongoose.models.Apprenant;
  const Formateur = mongoose.models.Formateur;

  if (!Apprenant || !Formateur) {
    console.error('Les modèles Apprenant ou Formateur ne sont pas définis.');
    return;
  }

  const apprenants = await Apprenant.find({ _id: { $in: formation.apprenants } });
  const formateur = await Formateur.findById(formation.formateur);

  const emails = apprenants.map((a) => a.email);
  if (formateur?.email) emails.push(formateur.email);

  const subject = isOpened
    ? `Ouverture de la session : ${formation.name}`
    : `Annulation de la session : ${formation.name}`;

    const formattedDate = formatDate(formation.startDate);

  const text = isOpened
    ? `Bonjour,\n\nLa session "${formation.name}" est confirmée pour le ${formattedDate}.\n\nCordialement,\nL'équipe de Maison des savoirs.`
    : `Bonjour,\n\nLa session "${formation.name}" est annulée faute de participants.\n\nCordialement,\nL'équipe de Maison des savoirs.`;

  try {
    await transporter.sendMail({ from: 'yasminesoussie71@gmail.com', to: emails, subject, text });
    console.log('📧 Email envoyé avec succès.');
  } catch (err) {
    console.error('Erreur lors de l’envoi de l’e-mail :', err);
  }
}

// Vérification et création de sessions
async function checkAndCreateSessions() {
  const now = new Date();
  const startWindowBegin = new Date(now.getTime() + 5 * 60 * 1000);
  const startWindowEnd = new Date(now.getTime() + 6 * 60 * 1000);

  console.log(`📅 Vérification des sessions prévues entre ${startWindowBegin} et ${startWindowEnd}`);

  // Récupérer toutes les formations dont la startDate est définie
  const allFormations = await Formation.find({
    startDate: { $exists: true, $ne: null },
  });

  // Filtrer en JS celles dont la date convertie est dans la plage
  const formationsSoon = allFormations.filter(f => {
    const startDate = new Date(f.startDate);  // conversion string -> Date
    return startDate >= startWindowBegin && startDate <= startWindowEnd;
  });

  console.log('Formations filtrées (démarrage dans 15-16 min):', formationsSoon.length);

  for (const formation of formationsSoon) {
    if (formation.apprenants.length >= 2) {
      const session = new Session({
        formation: formation._id,
        status: 'planned',
        apprenants: formation.apprenants,
        formateur: formation.formateur,
        startDate: formation.startDate, // Copier la date de début de la formation
        endDate: formation.endDate,     // Copier la date de fin de la formation
      });
      await session.save();
      await sendEmail(formation, true);
      console.log(`✅ Session créée pour "${formation.name}".`);
    } else {
      await sendEmail(formation, false); // Notifier les apprenants et formateurs de l'annulation
      
      // Dissocier la formation des apprenants
      const Apprenant = mongoose.models.Apprenant;
      if (Apprenant) {
        for (const apprenantId of formation.apprenants) {
          const apprenant = await Apprenant.findById(apprenantId);
          if (apprenant && apprenant.formations) {
            apprenant.formations = apprenant.formations.filter(
              (formationId) => !formationId.equals(formation._id)
            );
            await apprenant.save();
            console.log(`🧹 Formation "${formation.name}" supprimée de l'apprenant ${apprenant._id}.`);
          }
        }
      }
    
      // Supprimer les apprenants de la formation
      formation.apprenants = [];
      await formation.save();
      console.log(`❌ Session annulée pour "${formation.name}" et apprenants dissociés.`);
    }

  }
}


// Mise à jour des statuts des sessions
async function updateSessionStatuses() {
  const now = new Date();

  // Passage planned -> on going
  const sessionsToStart = await Session.find({ status: 'planned' }).populate('formation');
  for (const session of sessionsToStart) {
    const startDate = new Date(session.startDate);
    if (startDate <= now) {
      session.status = 'on going';
      await session.save();
      console.log(`✅ Session ${session._id} passée à "on going".`);
    }
  }

  // Passage on going -> finished
  const sessionsToFinish = await Session.find({ status: 'on going' }).populate('formation');
  for (const session of sessionsToFinish) {
    const endDate = new Date(session.endDate);
    if (endDate <= now) {
      session.status = 'finished';
      await session.save();
      console.log(`✅ Session ${session._id} terminée.`);

      // Rendre la salle disponible
      if (session.salle) {
        const Salle = mongoose.models.Salle;
        const salle = await Salle.findById(session.salle);
        if (salle) {
          salle.disponible = true;
          await salle.save();
          console.log(`🔓 Salle ${salle.nom} libérée et disponible.`);
        }
      }

      // Supprimer apprenants de la formation
      const formation = await Formation.findById(session.formation._id);
      if (formation) {
        const apprenantIds = formation.apprenants;

        const Apprenant = mongoose.models.Apprenant;
        if (Apprenant) {
          for (const apprenantId of apprenantIds) {
            const apprenant = await Apprenant.findById(apprenantId);
            if (apprenant && apprenant.formations) {
              apprenant.formations = apprenant.formations.filter(
                (id) => !id.equals(formation._id)
              );
              await apprenant.save();
              console.log(`🧹 Formation "${formation.name}" supprimée de l'apprenant ${apprenant._id}.`);
            }
          }
        }

        formation.apprenants = [];
        await formation.save();
        console.log(`🧹 Apprenants dissociés de la formation "${formation.name}".`);
      }

      // Générer certificats et envoyer en pièce jointe
      const Apprenant = mongoose.models.Apprenant;

      for (const apprenantId of session.apprenants) {
        const apprenant = await Apprenant.findById(apprenantId);
        if (!apprenant) continue;

        // Générer certificat
        const certPath = await generateCertificate(apprenant, session, formation);

        // Enregistrer en base
        await Certificate.create({
          apprenant: apprenant._id,
          session: session._id,
          path: certPath,
        });

        // Envoi email avec pièce jointe
        try {
          await transporter.sendMail({
            from: 'yasminesoussie71@gmail.com',
            to: apprenant.email,
            subject: `Votre certificat pour la session ${formation.name}`,
            text: `Bonjour ${apprenant.name},\n\nFélicitations pour avoir terminé la session "${formation.name}". Veuillez trouver votre certificat en pièce jointe.\n\nCordialement,\nMaison des savoirs`,
            attachments: [
              {
                filename: certPath.split('/').pop(), // nom fichier
                path: `.${certPath}`, // chemin relatif à partir de la racine du projet, par ex './uploads/certif-xxxx.png'
                cid: 'certificat' // facultatif, utile si tu veux insérer l’image inline dans le mail
              },
            ],
          });
          console.log(`📧 Certificat envoyé à ${apprenant.email} en pièce jointe.`);
        } catch (err) {
          console.error(`Erreur envoi email à ${apprenant.email} :`, err);
        }
      }
    }
  }
}




// Planification des tâches
cron.schedule('*/1 * * * *', async () => {
  await checkAndCreateSessions();
  await updateSessionStatuses();
});

module.exports = Formation;

