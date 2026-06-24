const mongoose = require('mongoose');

const SessionFormationSchema = new mongoose.Schema({
    formation: { type: mongoose.Schema.Types.ObjectId, ref: 'Formation', required: true },
    formateur: { type: mongoose.Schema.Types.ObjectId, ref: 'Formateur', required: true },
    apprenants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Apprenant' // Assurez-vous que ce nom correspond à votre modèle Apprenant
        }
    ],
    status: { type: String, enum: ['planned', 'on going', 'finished'], default: 'planned' },
    startDate: String,
  endDate: String,
  salle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Salle',
  },
  
});

// Réutiliser le modèle s'il existe déjà pour éviter les erreurs
module.exports = mongoose.models.SessionFormation || mongoose.model('SessionFormation', SessionFormationSchema);
