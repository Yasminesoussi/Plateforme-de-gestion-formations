const express = require('express');
const router = express.Router();
const SalleController = require('../controllers/salleController');

router.post('/ajouterSalle', SalleController.ajouterSalle);

router.get('/getSalles', SalleController.getAllSalles);

router.put('/affecterSalle', SalleController.affecterSalle)

router.delete('/suppSalle/:salleId', SalleController.supprimerSalle);

module.exports = router;
