const express = require('express');
var router = express.Router();
var avisController = require('../controllers/avisController');

router.post('/avisadd' , avisController.submitAvis);


router.get('/getAllAvis' , avisController.getAllAvis);

router.post('/respond', avisController.respondToAvis);


router.delete('/avisSupp/:avisId' , avisController.SupprimerAvis );
module.exports = router;



