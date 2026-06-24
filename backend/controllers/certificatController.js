const Certificate = require('../models/Certificate');


module.exports.getAllCertifs = async (req, res) => {
    try {
      // Récupérer tous les certificats avec les données des apprenants et des sessions associées
      const certificates = await Certificate.find()
        .populate('apprenant', 'name email') // Inclure les champs 'name' et 'email' de l'apprenant
        .populate({
            path: 'session',
            populate: {
              path: 'formation',
              select: 'name', // Inclure uniquement le champ 'name' de la formation
            },
          }) // Inclure les champs 'formation', 'startDate', et 'endDate' de la session
        .exec();
  
      if (!certificates || certificates.length === 0) {
        return res.status(404).json({ message: 'Aucun certificat trouvé.' });
      }
  
      res.status(200).json(certificates);
    } catch (error) {
      console.error('Erreur lors de la récupération des certificats :', error);
      res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
  };
  
  

  module.exports.SupprimerCertificat = async (req, res) => {
    try {
      const { certificatId } = req.params;
  
      // Vérifier si le certificat existe
      const certificat = await Certificate.findById(certificatId);
      if (!certificat) {
        return res.status(404).json({ message: 'Certificat non trouvé' });
      }
  
      // Supprimer le certificat
      await certificat.deleteOne();
  
      res.json({ message: 'Certificat supprimé avec succès' });
    } catch (error) {
      console.error('Erreur lors de la suppression du certificat :', error);
      res.status(500).json({ message: 'Erreur serveur interne' });
    }
  };

  module.exports.getFilteredCertificates = async (req, res) => {
    try {
      const search = req.query.search || ''; // texte tapé côté Angular
  
      const certificates = await Certificate.find()
        .populate({
          path: 'session',
          populate: {
            path: 'formation',
            model: 'Formation'
          }
        })
        .populate('apprenant');
  
      // Filtrage par nom de formation (si renseigné)
      const filtered = certificates.filter(cert =>
        cert.session?.formation?.name?.toLowerCase().includes(search.toLowerCase())
      );
  
      res.status(200).json(filtered);
    } catch (err) {
      console.error('Erreur lors de la récupération des certificats filtrés :', err);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  };