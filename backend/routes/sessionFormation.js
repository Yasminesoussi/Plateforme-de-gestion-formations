const express = require('express');
var router = express.Router();
var upload = require('../database/fileconfig');

var sessionFormationController = require('../controllers/sessionFormation');


router.get('/getSession/:id', sessionFormationController.getSession);


router.get('/allSessions', sessionFormationController.getAllSessions);

router.get('/getSessionByFormateur/:formateur', sessionFormationController.getSessionByFormateur);

router.delete('/SessionSupp/:sessionId', sessionFormationController.SupprimerSession);

module.exports = router;