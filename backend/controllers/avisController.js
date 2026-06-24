const Avis = require('../models/Avis');
const Apprenant = require('../models/Apprenant');
const Formateur = require('../models/Formateur');
var upload = require('../database/fileconfig');

// Soumettre un avis
// Soumettre un avis
module.exports.submitAvis = async (req, res) => {
  try {
    const { userId, titre, contenu, dateExperience, note } = req.body;

    // Vérification des données obligatoires
    if (!userId || !titre || !contenu || !dateExperience || !note) {
      return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
    }

    // Déterminer le rôle de l'utilisateur dynamiquement
    let userRole;

    const apprenant = await Apprenant.findById(userId);
    if (apprenant) {
      userRole = 'Apprenant';
    }

    const formateur = await Formateur.findById(userId);
    if (formateur) {
      userRole = 'Formateur';
    }

    if (!userRole) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' });
    }

    // Création et sauvegarde de l'avis
    const avis = new Avis({
      user: userId,
      userRole,
      titre,
      contenu,
      dateExperience,
      note,
    });

    await avis.save();

    res.status(201).json({ message: 'Avis soumis avec succès.', avis });
  } catch (error) {
    console.error('Erreur lors de la soumission de l\'avis :', error);
    res.status(500).json({ message: 'Erreur interne du serveur.', error });
  }
};


// Récupérer tous les avis// Récupérer tous les avis
module.exports.getAllAvis = async (req, res) => {
  try {
    const avis = await Avis.find()
      .populate({
        path: 'user',
        select: 'name image role',
      })
      .sort({ createdAt: -1 });

    const baseUrl = `${req.protocol}://${req.get('host')}`;

    const avisWithImages = avis.map((avis) => {
      if (avis.user?.image?.path) {
        avis.user.image.path = avis.user.image.path.startsWith('/uploads')
          ? `${baseUrl}${avis.user.image.path}`
          : `${baseUrl}/uploads/${avis.user.image.path.replace(/^.*[\\\/]/, '')}`;
      }
      return avis;
    });

    res.status(200).json(avisWithImages);
  } catch (error) {
    console.error('Erreur lors de la récupération des avis :', error);
    res.status(500).json({ message: 'Erreur interne du serveur.', error });
  }
};



// Répondre à un avis
module.exports.respondToAvis = async (req, res) => {
  try {
    const { avisId, response } = req.body;

    if (!response || response.trim() === '') {
      return res.status(400).json({ message: 'La réponse ne peut pas être vide.' });
    }

    const updatedAvis = await Avis.findByIdAndUpdate(
      avisId,
      { response },
      { new: true }
    );

    if (!updatedAvis) {
      return res.status(404).json({ message: 'Avis introuvable.' });
    }

    res.status(200).json({ message: 'Réponse ajoutée avec succès.', avis: updatedAvis });
  } catch (error) {
    console.error('Erreur lors de la réponse à un avis :', error);
    res.status(500).json({ message: 'Erreur interne du serveur.', error });
  }
};




// Récupérer les avis par utilisateur
module.exports.getAvisByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const avis = await Avis.find({ user: userId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    if (!avis || avis.length === 0) {
      return res.status(404).json({ message: 'Aucun avis trouvé pour cet utilisateur.' });
    }

    res.status(200).json(avis);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des avis.', error });
  }
};



module.exports.SupprimerAvis = async (req, res) => {
  try {
    const { avisId } = req.params;

    // Vérifier si le avis existe
    const avis = await Avis.findById(avisId);
    if (!avis) {
      return res.status(404).json({ message: 'avis non trouvé' });
    }

    // Supprimer l'avis'
    await avis.deleteOne();

    res.json({ message: 'Avis supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du avis :', error);
    res.status(500).json({ message: 'Erreur serveur interne' });
  }
};
