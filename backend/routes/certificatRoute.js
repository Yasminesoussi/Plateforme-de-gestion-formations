const express = require('express');
var router = express.Router();
var certificatController = require('../controllers/certificatController');

router.get('/getAllCertifs' , certificatController.getAllCertifs );

router.delete('/certificatSupp/:certificatId' , certificatController.SupprimerCertificat );

router.get('/getFilteredCertificates', certificatController.getFilteredCertificates);
module.exports = router;