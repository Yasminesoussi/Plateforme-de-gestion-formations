const express = require('express');
var router = express.Router();
var upload = require('../database/fileconfig');
var authController = require('../controllers/auth')
var formateurController = require('../controllers/formateurController');

router.post(
    '/signupFormateur',
    upload.fields([
      { name: 'cv', maxCount: 1 },
      { name: 'image', maxCount: 1 }
    ]),
    formateurController.signUp
  );
  

router.put('/changePassword/:id' ,  formateurController.changePassword);
//signin route formateur && apprenant
router.post('/signIn', authController.signIn);
router.post('/AffecterFormationAFormateur'  , formateurController.affecterFormationAFormateur);

router.get('/formations/:formateurId' , formateurController.getFormationsForFormateur);

router.get('/getAllFormateurs' , formateurController.getAllFormateurs);


router.get('/getbyId/:id' , formateurController.getById);

//ma tbdlesh password f editProfile
router.put('/editProfile/:id' , formateurController.editProfile);

//forget
router.post('/forgotPassword', formateurController.forgetPassword);
router.post('/reset-password/:token', formateurController.resetPassword);


router.get('/getFormateurByFormation/:formationId', formateurController.getFormateurByFormation);



router.get('/downloadcv/:id', formateurController.downloadCvByFormateur);


// Route pour activer un formateur
router.post('/:formateurId/activate', formateurController.activateFormateur);


// Route pour mettre à jour le CV du formateur
router.put('/:formateurId/cv', upload.single('cv'), formateurController.updateCv);



router.get('/filterFormateur', formateurController.filterFormateursByName);
module.exports = router;
