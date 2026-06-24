const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var schemaApprenant = mongoose.Schema({

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
telephone: {
    type: String
},
adresse: {
    type: String
},

role : {
type: String,
default: 'Apprenant'
},

image : {
    name: String,
    path: String
},
verificationToken: { type: String },
status: {
    type:String, enum:['active', 'inactive'], default: 'inactive'
},

resetToken: String,
resetTokenExpire: Date,

formations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Formation'}],
});



//hashage password
schemaApprenant.pre('save', async function(next){

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
schemaApprenant.methods.comparePassword = async function (candidatePassword){

    return bcrypt.compare(candidatePassword, this.password);
};
module.exports = mongoose.model('Apprenant', schemaApprenant);