const mongoose = require('mongoose');

const avisSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'userRole', // Dynamique selon le rôle
  },
  userRole: {
    type: String,
    required: true,
    enum: ['Apprenant', 'Formateur'], // Les modèles possibles
  },
  titre: {
    type: String,
    required: true,
    trim: true,
  },
  contenu: {
    type: String,
    required: true,
    trim: true,
  },
  dateExperience: {
    type: Date,
    required: true,
  },
  note: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  
  response: {
    type: String,
    trim: true,
  },
});

const Avis = mongoose.model('Avis', avisSchema);

module.exports = Avis;
