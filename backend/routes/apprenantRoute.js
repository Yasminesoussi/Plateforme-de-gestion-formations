const express = require('express');
var router = express.Router();
var upload = require('../database/fileconfig');
var authController = require('../controllers/auth')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const crypto = require("crypto");
const uuid = require('uuid')

var apprenantController = require('../controllers/apprenantController');

router.post('/signupApprenant' ,  upload.single('image'), apprenantController.signUp);

router.post('/signIn', authController.signIn);


//ma tbdlesh password f editProfile
router.put('/editProfile/:id' , apprenantController.editProfile);

router.post('/forgot-password', apprenantController.forgetPassword);
router.post('/reset-password/:token', apprenantController.resetPassword);


//inscrire apprenant dans formation
router.post('/:apprenantId/formations/:formationId/enroll/', apprenantController.inscrireFormation);



//desinscrire apprenant d formation
router.post('/:apprenantId/formations/:formationId/unenroll/', apprenantController.desinscrireFormation);

router.get('/getbyId/:id' , apprenantController.getById);
router.get('/getAllApprenants' , apprenantController.getAllApprenants);


//veriifier l existance de inscription apprennat 
router.get('/:apprenantId/formations/:formationId/est-inscrit', apprenantController.estInscritFormation);


//change password 
router.put('/changePassword/:id' ,  apprenantController.changePassword);




router.get('/:apprenantId/formations', apprenantController.getFormationsByApprenantId);


router.post('/contact', apprenantController.sendContactMessage);


router.get('/verify-email', apprenantController.verifyEmail);


router.get('/filter', apprenantController.filterApprenantsByName);



module.exports = router;