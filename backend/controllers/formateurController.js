const Formateur = require('../models/Formateur');
const Formation = require('../models/Formation');
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const crypto = require("crypto");
const uuid = require('uuid')
const Apprenant = require('../models/Apprenant');



var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: `${process.env.USER_EMAIL}`,
    pass: `${process.env.USER_PASSWORD}`
  }
})


module.exports.filterFormateursByName = async (req, res) => {
  try {
    const search = req.query.name || '';

    const formateurs = await Formateur.find({
      name: { $regex: new RegExp(search, 'i') } // insensible à la casse
    }).populate('formations'); // populate les formations liées

    res.status(200).json(formateurs);
  } catch (error) {
    console.error('Erreur de filtrage des formateurs :', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des formateurs filtrés.' });
  }
};


module.exports.forgetPassword = async (req, res) => {
  const { email } = req.body;

  try {
      // Chercher l'utilisateur dans les deux collections
      let user = await Formateur.findOne({ email });
      let userType = "formateur";

      if (!user) {
          user = await Apprenant.findOne({ email });
          userType = "apprenant";
      }

      if (!user) {
          return res.status(404).json({ message: "Aucun utilisateur trouvé avec cet email" });
      }

      // Générer un token
      const token = crypto.randomBytes(20).toString("hex");
      const expiry = new Date(Date.now() + 3600000); // 1 heure

      user.resetToken = token;
      user.resetTokenExpire = expiry;
      await user.save();

      // Préparer le lien avec un paramètre de type
      const resetLink = `http://localhost:4200/reset-password/${token}?type=${userType}`;

      // Envoyer l'e-mail
      const mailOptions = {
          to: user.email,
          from: process.env.USER_EMAIL,
          subject: "Réinitialisation du mot de passe",
          html: `
    <p>Bonjour,</p>
    <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
    <p><a href="${resetLink}">Réinitialiser mon mot de passe</a></p>
   
    <p>Merci,<br>L'équipe Maison des savoirs</p>
  `

      };

      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              console.error("Erreur lors de l'envoi de l'email :", error);
              return res.status(500).json({ message: "Erreur interne du serveur" });
          }
          res.json({ message: "Email de réinitialisation envoyé avec succès" });
      });

  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur interne du serveur" });
  }
}


module.exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    // Chercher dans Formateur
    let user = await Formateur.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() },
    });

    // Si non trouvé, chercher dans Apprenant
    if (!user) {
      user = await Apprenant.findOne({
        resetToken: token,
        resetTokenExpire: { $gt: Date.now() },
      });
    }

    // Si toujours rien, token invalide
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Réinitialiser le mot de passe
    user.password = newPassword;
    user.resetToken = null;
    user.resetTokenExpire = null;
    await user.save();

    return res.json({ message: "Password reset successfully" });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};




module.exports.getFormationsForFormateur  = async (req, res) => {
  try{
    const { formateurId } = req.params;
    //verifier si le formateur existe
    const formateur = await Formateur.findById(formateurId).populate(
      "formations"
    );
    if(!formateur){
      return res.status(404).json({ message : "formateur non trouve "});
    }
    //recuperer toutes les formations
    const formations = formateur.formations;
    res.json({ formations});

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
};


module.exports.affecterFormationAFormateur = async (req, res) => {
  try {
    const { formateurId, formationId } = req.body;

    // Vérifier si le formateur existe
    const nouveauFormateur = await Formateur.findById(formateurId);
    if (!nouveauFormateur) {
      return res.status(404).json({ message: "Formateur non trouvé." });
    }

    // ✅ Vérifier que le formateur a le statut 'active'
    if (nouveauFormateur.status !== "active") {
      return res.status(403).json({ message: "Le formateur n'est pas actif. Affectation impossible." });
    }

    // Vérifier si la formation existe
    const formation = await Formation.findById(formationId);
    if (!formation) {
      return res.status(404).json({ message: "Formation non trouvée." });
    }

    // Vérifier si la formation est déjà affectée à ce formateur
    if (nouveauFormateur.formations.includes(formationId)) {
      return res
        .status(400)
        .json({ message: "Cette formation est déjà affectée à ce formateur." });
    }

    // Si la formation est déjà affectée à un autre formateur, la retirer de sa liste
    if (formation.formateur && formation.formateur.toString() !== formateurId) {
      const ancienFormateur = await Formateur.findById(formation.formateur);
      if (ancienFormateur) {
        ancienFormateur.formations = ancienFormateur.formations.filter(
          (fid) => fid.toString() !== formationId
        );
        await ancienFormateur.save();
      }
    }

    // Affecter la formation au nouveau formateur
    formation.formateur = formateurId;
    nouveauFormateur.formations.push(formationId);

    await formation.save();
    await nouveauFormateur.save();

    res.json({ message: "Formation affectée au formateur avec succès." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
};




module.exports.editProfile = async (req, res) => {
  try {
    const updatedUserData = req.body;
    const { id } = req.params;

    const formateur = await Formateur.findByIdAndUpdate(id, updatedUserData, {
      new: true
    });

    if (!formateur) {
      return res.json('formateur not found');
    }

    res.json(formateur);
  } catch (error) {
    console.error('error updating user profile', error);
    res.status(500).json({ message: 'internal server error' });
  }
};



module.exports.getById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const formateur = await Formateur.findById(id)
      .populate('formations', 'name')  // Peupler uniquement le champ 'name' des formations
      .exec();

    if (!formateur) {
      return res.status(404).json("Formateur non trouvé");
    }

    res.status(200).json(formateur);
  } catch (err) {
    res.status(500).json({ message: "Erreur du serveur", error: err });
  }
};




module.exports.getAllFormateurs = async (req, res) => {
  try {
    const formateurs = await Formateur.find().populate('formations'); // 👈 ICI

    if (!formateurs || formateurs.length === 0) {
      return res.status(404).json("Aucun formateur trouvé");
    }

    res.status(200).json(formateurs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




module.exports.changePassword = async (req, res) => {
  try {
    const id = req.params.id
    const { currentPassword, newPassword } = req.body

    // Vérifier si l'utilisateur existe
    const formateur = await Formateur.findById(id)
    if (!formateur) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Vérifier si le mot de passe actuel est correct
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      formateur.password
    )
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid current password' })
    }

    // Hacher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Mettre à jour le mot de passe de l'utilisateur
    await Formateur.findByIdAndUpdate(id, { password: hashedPassword })

    res.json({ message: 'Password changed successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports.signUp = async (req, res, next) => {
  try {
    // Récupérer les fichiers
    const cvFile = req.files?.cv?.[0]; // Le premier fichier pour le champ 'cv'
    const imageFile = req.files?.image?.[0]; // Le premier fichier pour le champ 'image'

    const { name, email, password, telephone, adresse, specialite } = req.body;

    // Vérifie si l'email est déjà utilisé
    const existing = await Formateur.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Cet email est déjà utilisé.' });
    }

    // Créer l'utilisateur
    const user = new Formateur({
      name,
      email,
      password,
      telephone,
      adresse,
      specialite,
      cv: cvFile
        ? { name: cvFile.originalname, path: cvFile.path }
        : undefined,
      image: imageFile
        ? { name: imageFile.originalname, path: imageFile.path }
        : undefined
    });

    await user.save();

    return res.status(201).json({ message: 'Formateur ajouté avec succès. En attente activation du compte par administrateur.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
};




module.exports.getFormateurByFormation = async(req,res) => {
  try{
    const {formationId} = req.params;
    if(!formationId){
      return res.status(400).json({
        success: false,
        message:"formation id is required"

      });
    }

    const formateurs = await Formateur.find({formations: formationId})
    .select('_id name email');
    return res.status(200).json(formateurs);
  }catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'internal server error' })
  }

} 



module.exports.downloadCvByFormateur = async(req,res) => {
  try{
    const formateurcv = await Formateur.findById(req.params.id);
    if(!formateurcv){
      return res.status(404).send("formateur not found");
    }
    res.sendFile(formateurcv.cv.path);
  }catch(err){
    res.status(500).send(err)
  }
};




// Fonction pour activer un formateur
module.exports.activateFormateur = async (req, res) => {
  const {formateurId} = req.params;
  
  try {
    const formateur = await Formateur.findById(formateurId);
    if (!formateur) {
      return res.status(404).json({ message: 'Formateur non trouvé' });
    }

    // Activer le formateur
    formateur.status = 'active';
    await formateur.save();

    // Envoyer l'e-mail de confirmation
    await sendActivationEmail(formateur);

    res.status(200).json({
      message: 'Formateur activé avec succès',
      formateur,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'activation du formateur', error: error.message });
  }
};


// Fonction pour envoyer un e-mail de confirmation

async function sendActivationEmail (formateur) {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Ou un autre service
    auth: {
      user: `${process.env.USER_EMAIL}`,
      pass: `${process.env.USER_PASSWORD}`
    }
  });

  const mailOptions = {
    from: 'yasminesoussie71@gmail.com',
    to: formateur.email,
    subject: 'Activation de votre compte',
    text: `Bonjour ${formateur.name},\n\nVotre compte formateur a été activé avec succès. Vous pouvez maintenant vous connecter.\n\nCordialement,\nL'équipe de la Maison des savoirs`,
  };

  // Envoi de l'e-mail
  await transporter.sendMail(mailOptions);
};





module.exports.updateCv = async (req, res) => {
  try {
    // Trouver le formateur par ID
    const formateur = await Formateur.findById(req.params.formateurId);
    if (!formateur) {
      return res.status(404).json({ message: "Formateur non trouvé" });
    }

    // Extraire le nom et le chemin du fichier du CV
    const { originalname, path } = req.file;

    // Mettre à jour les informations du CV du formateur
    formateur.cv = { name: originalname, path: path };

    // Sauvegarder le formateur avec le nouveau CV
    await formateur.save();

    // Retourner un message de succès
    res.json({ message: 'Le CV a été mis à jour avec succès.', cv: formateur.cv });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du CV', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};


