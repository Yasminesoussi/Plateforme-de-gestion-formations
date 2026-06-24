const express = require('express');
var router = express.Router();
var categoryController = require('../controllers/categoryController');
const auth= require("../controllers/auth");
router.post('/categoryAdd' , categoryController.addCategory);
router.get('/categoryGet' ,   categoryController.getAllCategory);
router.put('/categoryupdate/:id' , categoryController.updateCategory);
router.delete('/categoryDelete/:id' , categoryController.deleteCategory);

router.get('/categorygetById/:id' , categoryController.getById);
module.exports = router;