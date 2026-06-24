const SessionFormation = require('../models/sessionFormation')
const Formation = require('../models/Formation')
const Formateur = require('../models/Formateur')

const Salle = require('../models/Salle'); // Assure-toi d’importer le modèle Salle


module.exports.getSession = async (req, res) => {
  try {
    const sessionId = req.params.id;
    const session = await SessionFormation.findById(sessionId)
      .populate('formation')
      .populate('formateur')
      .populate('apprenants');

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.status(200).json(session);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération de la session" });
  }
};

module.exports.getSessionByFormateur = async (req, res) => {
  try {
    
    const   formateur  = req.params.formateur;
    const session = await SessionFormation.find({formateur: formateur})
      .populate('formation')
      .populate('formateur')
      .populate('apprenants')
      .populate('salle', 'nom'); 

      console.log(session)
      if (!formateur) {
        return res.status(404).json({ message: 'Formateur not found' });
      }
  
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.status(200).json(session);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération de la session" });
  }


};

module.exports.getAllSessions = async (req, res) => {
  try {
    const sessions = await SessionFormation.find()
    .populate('formation', 'name startDate endDate')  // Récupère seulement le nom de la formation
      .populate('formateur', 'name')  // Récupère seulement le nom du formateur
      .populate('apprenants', 'name') // Récupère les noms des apprenants
      .populate('salle', 'nom'); 

    res.status(200).json(sessions);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des sessions", error: err });
  }
};


module.exports.SupprimerSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    // 1. Vérifier si la session existe
    const session = await SessionFormation.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session non trouvée' });
    }

    // 2. Supprimer l'ID de la session dans la salle liée
    await Salle.updateMany(
      { sessions: sessionId },
      { $pull: { sessions: sessionId } }
    );

    // 3. Supprimer la session
    await session.deleteOne();

    res.json({ message: 'Session supprimée avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la suppression de la session' });
  }
};
