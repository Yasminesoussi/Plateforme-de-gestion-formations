const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var schemaFormateur = mongoose.Schema({

name: {
    type : String
},

email : {
    type : String,
    required: true,
    unique: true,   // ← c’est ici que tu indiques à MongoDB que cet email ne doit pas se répéter
    lowercase: true,
    trim: true,
},
password : {

    type : String,
    required: true,
},
telephone: {
    type: String
},
adresse: {
    type: String
},

image : {
    name: String,
    path: String
},

// Ajout enum spécialité
specialite: {
    type: String,
    enum: [
      'Développement web',
      'Développement Mobile',
      'Intelligence Artificielle et Automatisation',
      'Administration et Sécurité des Réseaux',
      'Bases de données avancées et Big Data',
      'Autres'
    ],
    required: true
  },

cv: {
    name: String, path: String
},

role : {
type: String,
default: 'formateur'
},

status : { type: String, enum: ['active', 'inactive'], default: 'inactive'},

resetToken: { type: String, default: null },
resetTokenExpire: { type: Date, default: null },

formations: [{type: mongoose.Schema.Types.ObjectId, ref: 'Formation'}],
});



//hashage password


schemaFormateur.pre('save', async function(next){

const user = this; 
if(user.isModified('password' || user.isNew)){
    try{

const salt = await bcrypt.genSalt(10);
const hash = await bcrypt.hash(user.password, salt);
user.password = hash;
next();
    }catch(err){
        return next(err);
    }

    }else{
        return next();
    }

});

schemaFormateur.methods.comparePassword = async function (candidatePassword){

    return bcrypt.compare(candidatePassword, this.password);

};


module.exports = mongoose.model('Formateur', schemaFormateur);