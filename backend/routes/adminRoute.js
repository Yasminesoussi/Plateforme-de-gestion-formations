const express = require('express');
var router = express.Router();
var adminController = require('../controllers/adminController');
var auth = require('../controllers/auth');
const Admin = require('../models/Admin');

router.post('/signupAdmin' , adminController.signUpAdmin);
router.post('/signIn' , adminController.signInAdmin);


router.put('/editProfile/:id', adminController.editProfile);



// Récupérer les notifications
router.get('/notifications', async (req, res) => {
    try {
      const admin = await Admin.findOne().select('notifications');
      res.json(admin.notifications);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Marquer comme lue
  router.patch('/notifications/read', async (req, res) => {
    try {
      const { ids } = req.body;
      
      await Admin.updateOne(
        { 'notifications._id': { $in: ids } },
        { $set: { 'notifications.$[elem].read': true } },
        { arrayFilters: [{ 'elem._id': { $in: ids } }] }
      );
  
      res.status(200).json({ message: 'Notifications marquées comme lues' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


  // Supprimer toutes les notifications
router.delete('/notifications/clear', async (req, res) => {
  try {
    const admin = await Admin.findOne(); // Tu peux adapter selon ton système d'authentification (ex: avec req.user.id)
    if (!admin) {
      return res.status(404).json({ message: 'Admin non trouvé' });
    }

    admin.notifications = []; // Vider le tableau des notifications
    await admin.save();

    res.status(200).json({ message: 'Historique des notifications supprimé' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


  

module.exports = router;