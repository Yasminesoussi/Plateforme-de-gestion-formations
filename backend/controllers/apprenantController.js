require('dotenv').config()
const Apprenant = require('../models/Apprenant')
const Admin = require('../models/Admin')
const Session = require('../models/SessionFormation')
const Formation = require('../models/Formation')
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const uuid = require('uuid')
const bcrypt = require('bcrypt')

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: `${process.env.USER_EMAIL}`,
    pass: `${process.env.USER_PASSWORD}`
  }
})

module.exports.sendContactMessage = async (req, res) => {
  const { name, email, message } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Tous les champs sont requis.' })
  }

  const mailOptions = {
    from: email,
    to: process.env.USER_EMAIL,
    replyTo: email,
    subject: `Message de contact de ${name} (${email})`,
    html: `
      <h3>Nouveau message reçu :</h3>
      <p><strong>Nom :</strong> ${name}</p>
      <p><strong>Email :</strong> ${email}</p>
      <p><strong>Message :</strong><br/>${message}</p>
    `
  }

  try {
    await transporter.sendMail(mailOptions)
    res.status(200).json({ message: 'Message envoyé avec succès !' })
  } catch (error) {
    console.error('Erreur lors de l’envoi :', error)
    res.status(500).json({ error: 'Échec de l’envoi du message.' })
  }
}

module.exports.getFormationsByApprenantId = async (req, res) => {
  try {
    const { apprenantId } = req.params
    const apprenant = await Apprenant.findById(apprenantId).populate(
      'formations'
    )
    if (!apprenant) {
      return res.status(404).json({ message: 'Apprenant non trouvé' })
    }
    res.json(apprenant.formations)
  } catch (err) {
    console.error('Erreur lors de la récupération des formations:', err)
    res.status(500).json({ message: 'Erreur interne du serveur' })
  }
}

module.exports.editProfile = async (req, res) => {
  try {
    const updatedUserData = req.body
    const { id } = req.params

    const apprenant = await Apprenant.findByIdAndUpdate(id, updatedUserData, {
      new: true
    })

    if (!apprenant) {
      return res.json('apprenant not found')
    }

    res.json(apprenant)
  } catch (error) {
    console.error('error updating user profile', error)
    res.status(500).json({ message: 'internal server error' })
  }
}


module.exports.verifyEmail = async (req, res) => {
  const { token } = req.query

  try {
    //find the apprenant by verification token
    const apprenant = await Apprenant.findOne({ verificationToken: token })
    console.log(apprenant)
    if (!apprenant) {
      return res
        .status(404)
        .json({ message: 'Apprenant not found or verification token expired' })
    }

    //update the status of the apprenant to "verified"
    apprenant.status = 'active'
    apprenant.verificationToken = null
    await apprenant.save()
    res.json('account verified')
  } catch (err) {
    console.erroe(err)
    res.Status(50).json({ message: 'internal server error' })
  }
}

async function sendVerificationEmail (email, token) {
  var message = {
    from: 'yasminesoussie71@gmail.com',
    to: email,
    subject: 'Confirmation de votre compte - Maison des savoirs',
    html: `
    <p>Bonjour,</p>
   
    <p>Veuillez cliquer sur le lien ci-dessous pour vérifier votre adresse email et activer votre compte :</p>
    <p><a href="http://localhost:4200/apprenant/verify-email?token=${token}">Vérifier mon adresse email</a></p>
    
    <p>Merci,<br>L'équipe Maison des savoirs</p>
  `
  }

  await transporter.sendMail(message, (err, info) => {
    if (err) {
      console.log(err)
    } else {
      console.log('Email sent:' + info.response)
    }
  })
}

module.exports.signUp = async (req, res, next) => {
  try {
    const verificationToken = uuid.v4()

    const { originalname, path } = req.file
    let user = new Apprenant({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      telephone: req.body.telephone,
      adresse: req.body.adresse,
      verificationToken: verificationToken,
      image: {
        name: originalname,
        path: path
      }
    })
    console.log(req.file)

    await user.save()
    res.status(201).json({ message: 'apprenant created' })
    await sendVerificationEmail(req.body.email, verificationToken)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'internal server error' })
  }
}

module.exports.resetPassword = async (req, res) => {
  const { token } = req.params
  const { newPassword } = req.body
  try {
    // Find user by reset token
    const user = await Apprenant.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() }
    })
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' })
    }

    // Update password
    user.password = newPassword
    user.resetToken = null
    user.resetTokenExpire = null
    await user.save()

    return res.json({ message: 'Password reset successfully' })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports.forgetPassword = async (req, res) => {
  const { email } = req.body

  try {
    // Trouver l'utilisateur par email
    const user = await Apprenant.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Générer un token de réinitialisation
    const token = crypto.randomBytes(20).toString('hex')

    // Définir la date d'expiration (1 heure)
    const now = new Date()
    const expiry = new Date(now.getTime() + 3600000) // 1 heure

    user.resetToken = token
    user.resetTokenExpire = expiry
    await user.save()

    // Options de l'email
    const mailOptions = {
      to: user.email,
      from: `${process.env.USER_EMAIL}`,
      subject: 'Reset your password',
      text: `Reset your password using this link: http://localhost:4200/reset-password/${token}\n`
    }

    // Envoi de l'email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending mail', error)
        return res.status(500).json({ message: 'Internal server error' })
      }
      res.json({ message: 'Password reset email sent successfully' })
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}


//Toujours ajoute l’apprenant à la formation. Ajoute à une session "planned" ou "on going" si elle existe.
exports.inscrireFormation = async (req, res) => {
  const { formationId, apprenantId } = req.params;
  const io = req.app.get('io');
  const adminConnections = req.app.get('adminConnections') || new Map();

  try {
    const [apprenant, formation, admin] = await Promise.all([
      Apprenant.findById(apprenantId),
      Formation.findById(formationId),
      Admin.findOne()
    ]);

    if (!apprenant)
      return res.status(404).json({ message: 'Apprenant non trouvé' });
    if (!formation)
      return res.status(404).json({ message: 'Formation non trouvée' });

    // 📌 Ajouter l’apprenant à la formation si ce n’est pas déjà fait
    const formationUpdateNeeded = !formation.apprenants.includes(apprenantId);
    if (formationUpdateNeeded) {
      formation.apprenants.push(apprenantId);
      await formation.save();
    }

    if (!apprenant.formations.includes(formation._id)) {
      apprenant.formations.push(formation._id);
      await apprenant.save();
    }

    // 🔍 Rechercher une session liée à la formation avec statut planned ou on going
    const session = await Session.findOne({
      formation: formationId,
      status: { $in: ['planned', 'on going'] }
    });

    // 👥 Ajouter l’apprenant à la session si trouvée et pas encore inscrit
    if (session && !session.apprenants.includes(apprenantId)) {
      session.apprenants.push(apprenantId);
      await session.save();
      console.log(`✅ Apprenant ajouté à la session ${session._id}`);
    }

    // 🔔 Notifier l'admin
    const notification = {
      message: `Nouvelle inscription: ${apprenant.name} à ${formation.name}`,
      relatedFormation: formationId,
      relatedStudent: apprenantId
    };

    if (admin) {
      admin.notifications.push(notification);
      await admin.save();
    }

    res.status(200).json({
      message: 'Apprenant inscrit avec succès',
      formation
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur lors de l'inscription",
      error: error.message
    });
  }
};

exports.estInscritFormation = async (req, res) => {
  const { apprenantId, formationId } = req.params

  try {
    // Exemple avec Mongoose : Apprenant a un champ `formations: [ObjectId]`
    const apprenant = await Apprenant.findById(apprenantId)

    if (!apprenant) {
      return res.status(404).json({ message: 'Apprenant non trouvé' })
    }

    const estInscrit = apprenant.formations.includes(formationId)

    return res.status(200).json({ estInscrit })
  } catch (error) {
    console.error('Erreur dans estInscritFormation :', error)
    return res.status(500).json({ message: 'Erreur serveur' })
  }
}

module.exports.changePassword = async (req, res) => {
  try {
    const id = req.params.id
    const { currentPassword, newPassword } = req.body

    // Vérifier si l'utilisateur existe
    const apprenant = await Apprenant.findById(id)
    if (!apprenant) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Vérifier si le mot de passe actuel est correct
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      apprenant.password
    )
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid current password' })
    }

    // Hacher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Mettre à jour le mot de passe de l'utilisateur
    await Apprenant.findByIdAndUpdate(id, { password: hashedPassword })

    res.json({ message: 'Password changed successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}


module.exports.desinscrireFormation = async (req, res) => {
  try {
    const { apprenantId, formationId } = req.params;

    const apprenant = await Apprenant.findById(apprenantId);
    const formation = await Formation.findById(formationId);

    if (!apprenant || !formation) {
      return res.status(404).json({ message: 'Apprenant ou formation non trouvé' });
    }

    // Retirer la formation de la liste des formations de l'apprenant
    apprenant.formations.pull(formationId);
    await apprenant.save();

    // Retirer l'apprenant de la liste des apprenants de la formation
    formation.apprenants.pull(apprenantId);
    await formation.save();

    // Retirer l'apprenant de toutes les sessions de cette formation
    await Session.updateMany(
      { formation: formationId },
      { $pull: { apprenants: apprenantId } }
    );

    res.status(200).json({ message: 'Désinscription réussie' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};



module.exports.getById = async (req, res) => {
  const { id } = req.params
  const apprenant = await Apprenant.findById(id)
  if (!apprenant) {
    res.status(404).json('apprenant not found')
  }
  res.status(200).json(apprenant)
}


module.exports.getAllApprenants = async (req, res) => {
  const apprenants = await Apprenant.find().populate('formations') // 👈 ICI
  if (!apprenants) {
    res.status(404).json('apprenants not found')
  }
  res.status(200).json(apprenants)
}


// GET /api/apprenants/filter?name=xxx

module.exports.filterApprenantsByName = async (req, res) => {
  try {
    const search = req.query.name || '';

    const apprenants = await Apprenant.find({
      name: { $regex: new RegExp(search, 'i') } // insensible à la casse
    }).populate('formations'); // populate les formations liées

    res.status(200).json(apprenants);
  } catch (error) {
    console.error('Erreur de filtrage des apprenants :', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des apprenants filtrés.' });
  }
};
