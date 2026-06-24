const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var schemaAdmin = mongoose.Schema({

name: {
    type : String
},

email : {
    type : String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
},
password : {

    type : String,
    required: true,
},

role : {
type: String,
default: 'admin'
},


notifications: [{
    message: String,
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    relatedFormation: { type: mongoose.Schema.Types.ObjectId, ref: 'Formation' },
    relatedStudent: { type: mongoose.Schema.Types.ObjectId, ref: 'Apprenant' }
  }]


});


//hashage password


schemaAdmin.pre('save', async function(next){

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

schemaAdmin.methods.comparePassword = async function (candidatePassword){

    return bcrypt.compare(candidatePassword, this.password);

};

module.exports = mongoose.model('Admin', schemaAdmin);