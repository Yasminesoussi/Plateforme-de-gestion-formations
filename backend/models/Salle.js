const mongoose = require('mongoose');

const SalleSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    unique: true
  },
  disponible: {
    type: Boolean,
    default: true
  },
  sessions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SessionFormation'
  }]
});

module.exports = mongoose.model('Salle', SalleSchema);
