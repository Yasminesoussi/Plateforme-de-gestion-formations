const Salle = require('../models/Salle');
const Session = require('../models/SessionFormation');


module.exports.ajouterSalle = async (req, res) => {
  try {
    const { nom } = req.body;

    if (!nom) {
      return res.status(400).json({ message: 'Le nom de la salle est requis.' });
    }

    // Vérifie si une salle avec le même nom existe déjà
    const salleExistante = await Salle.findOne({ nom });
    if (salleExistante) {
      return res.status(409).json({ message: 'Une salle avec ce nom existe déjà.' });
    }

    const nouvelleSalle = new Salle({ nom });
    await nouvelleSalle.save();

    res.status(201).json({ message: 'Salle ajoutée avec succès', salle: nouvelleSalle });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de l’ajout de la salle', error: err.message });
  }
};

module.exports.getAllSalles = async (req, res) => {
    try {
      const salles = await Salle.find()
        .populate({
          path: 'sessions',
          populate: {
            path: 'formation',
            select: 'name' // seulement le nom de la formation liée à la session
          },
          select: 'formation' // seulement le champ formation dans la session
        });
  
      res.status(200).json(salles);
    } catch (err) {
      res.status(500).json({ message: "Erreur lors de la récupération des salles", error: err.message });
    }
  };




// j ai fais Rendre la salle disponible à nouveau dans Formation.js 

exports.affecterSalle = async (req, res) => {
  const { salleId, sessionId } = req.body;

  try {
    // Récupérer la salle
    const salle = await Salle.findById(salleId);
    if (!salle) {
      return res.status(404).json({ message: 'Salle non trouvée' });
    }

    // Récupérer la session
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session non trouvée' });
    }

    // Vérifier si la session est terminée
    if (session.status === 'finished') {
      return res.status(400).json({ message: 'Impossible d\'affecter une salle à une session terminée' });
    }

    // Vérifier si la session a déjà une salle affectée
    if (session.salle) {
      return res.status(400).json({ message: 'Cette session a déjà une salle affectée. Réaffectation non autorisée.' });
    }

    // Vérifier si la salle est disponible
    if (!salle.disponible) {
      return res.status(400).json({ message: 'Cette salle est déjà occupée par une autre session.' });
    }

    // Ajouter la session à la salle
    if (!salle.sessions.includes(sessionId)) {
      salle.sessions.push(sessionId);
      salle.disponible = false; // Marquer la salle comme occupée
      await salle.save();
    }

    // Lier la salle à la session
    session.salle = salleId;
    await session.save();

    res.status(200).json({ message: 'Salle affectée à la session avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};


module.exports.supprimerSalle = async (req, res) => {
  const { salleId } = req.params;

  try {
    // Vérifie si la salle existe
    const salle = await Salle.findById(salleId);
    if (!salle) {
      return res.status(404).json({ message: 'Salle non trouvée.' });
    }

    // Supprimer la salle des sessions associées
    await Session.updateMany(
      { salle: salleId },
      { $unset: { salle: "" } } // Retirer la salle sans supprimer la session
    );

    // Supprimer la salle
    await Salle.findByIdAndDelete(salleId);

    res.status(200).json({ message: 'Salle supprimée avec succès, et dissociée de toutes les sessions.' });
  } catch (err) {
    console.error('Erreur lors de la suppression de la salle :', err);
    res.status(500).json({ message: 'Erreur lors de la suppression de la salle.', error: err.message });
  }
};

  
  
  

