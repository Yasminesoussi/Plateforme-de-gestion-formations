const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const certificateSchema = new Schema({
  apprenant: { type: Schema.Types.ObjectId, ref: 'Apprenant', required: true },
  session: { type: Schema.Types.ObjectId, ref: 'SessionFormation', required: true },
  path: { type: String, required: true }, // chemin relatif vers fichier dans /uploads/
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Certificate', certificateSchema);
