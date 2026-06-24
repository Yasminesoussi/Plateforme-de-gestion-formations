const express = require('express');
var router = express.Router();
var upload = require('../database/fileconfig');
var paymentController = require('../controllers/paymentController');


router.post('/:apprenantId/addPayment/:formationId' ,  paymentController.addPayment);

router.get('/getPayment/:apprenantId' ,  paymentController.findPaymentByApprenant);

router.get('/getAllPayments' ,  paymentController.getAllPayments);
router.get('/formationAll' ,  paymentController.getAllFormation);
module.exports = router;