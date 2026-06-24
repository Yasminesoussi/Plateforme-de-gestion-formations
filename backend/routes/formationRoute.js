const express = require('express');
var router = express.Router();

const auth= require("../controllers/auth");
var formationController = require('../controllers/formationController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // ou configure comme tu veux

router.post('/formationAdd' , upload.single('image'), formationController.addFormation);

router.delete('/formationsSupp/:formationId', formationController.SupprimerFormation);
router.get('/formationAll' ,  formationController.getAllFormation);

router.put('/formationUpdate/:id' ,  formationController.updateFormation);


router.post('/:formationId/:apprenantId/like' ,  formationController.likeFormation);
router.delete('/:formationId/:apprenantId/dislike' ,  formationController.dislikeFormation);

router.get('/formationByCategory/:category' ,  formationController.getFormationByCategory);
router.get('/formationgetById/:id' , formationController.getById);
router.get('/formationgetById/:id' , formationController.getById);
router.get('/searchTraining' , formationController.searchTraining);

router.get('/getFormationsWithLikes' , formationController.getFormationsWithLikes);

module.exports = router;