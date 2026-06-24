const Formation = require('../models/Formation')
const Payment = require('../models/Payment')
const Apprenant = require('../models/Apprenant')
module.exports.addPayment = async (req, res) => {
  const { apprenantId, formationId } = req.params;
  const { tranches } = req.body;

  try {
    const formation = await Formation.findById(formationId);
    const apprenantsIds = formation.apprenants;

    if (apprenantsIds.length < 2) {
      return res.status(400).json({
        success: false,
        message:
          "Cette formation n'a pas encore commencé (moins de 2 inscrits)."
      });
    }

    const isApprenantInscrit = apprenantsIds.some(id => id.equals(apprenantId));
    if (!isApprenantInscrit) {
      return res.status(400).json({
        success: false,
        message: "L'apprenant n'est pas inscrit à cette formation."
      });
    }

    let payment = await Payment.findOne({
      apprenant: apprenantId,
      formation: formationId
    });

    const training = await Formation.findById(formationId);

    if (!payment) {
      payment = new Payment({
        apprenant: apprenantId,
        formation: formationId,
        tranches: [],
        totalAmount: training.prix,
        montant_restant: training.prix,
        status: 'not_paid'
      });
    }

    // Vérifie si le montant de la tranche dépasse le montant restant
    if (tranches && tranches.montant_tranche > payment.montant_restant) {
      return res.status(400).json({
        success: false,
        message: "Le montant de la tranche dépasse le montant restant à payer."
      });
    }

    // Ajoute la tranche si elle existe
    if (tranches) {
      payment.tranches.push(tranches);
      payment.montant_restant -= tranches.montant_tranche;
    }

    if (payment.montant_restant <= 0) {
      payment.status = 'completed';
      payment.montant_restant = 0;
    } else if (payment.tranches.length > 0) {
      payment.status = 'pending';
    }

    await payment.save();

    res.json({
      success: true,
      message: 'Paiement mis à jour avec succès.',
      payment
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout du paiement:", error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur',
      error: error.message
    });
  }
};



module.exports.getAllFormation = async (req, res) => {
  try {
    //recup tous formatios de database
    const formations = await Formation.find()
      .populate('category')
      .populate('formateur')
    res.json(formations)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'internal server error' })
  }
}

module.exports.findPaymentByApprenant = async (req, res) => {
  try {
    const { apprenantId } = req.params;

    // Récupérer tous les paiements existants pour l'apprenant
    let payments = await Payment.find({ apprenant: apprenantId })
      .populate('apprenant', 'name email formations')
      .populate('formation', 'name prix apprenants')
      .exec();

    // Récupérer l'apprenant avec toutes ses formations
    const apprenant = await Apprenant.findById(apprenantId).populate('formations');

    if (!apprenant) {
      return res.status(404).json({ success: false, message: "Apprenant non trouvé." });
    }

    // Vérifier si l'apprenant n'est inscrit à aucune formation
    if (!apprenant.formations || apprenant.formations.length === 0) {
      // Ajouter les paiements existants, même si aucune formation active
      return res.json([
        ...payments,
        {
          success: false,
          message1: "L'apprenant n'est inscrit à aucune formation.",
          formations: [],
          apprenant: apprenant
        },
      ]);
    }

    // ID des formations déjà payées (ou ayant un paiement en cours)
    const existingFormationIds = payments.map(p => p.formation?._id?.toString());

    // Toutes les formations auxquelles l'apprenant est inscrit
    const allFormations = apprenant.formations || [];

    const combinedPayments = [...payments];






   // Vérification de chaque formation
const nonCommenceeFormations = []; // Liste pour stocker les noms des formations non commencées

for (const formation of allFormations) {
  const formationId = formation._id.toString();

  // Si AUCUN paiement n'existe pour cette formation => création d'un paiement virtuel "not_paid"
  if (!existingFormationIds.includes(formationId)) {
    const formationDoc = await Formation.findById(formationId);

    if (formationDoc.apprenants.length < 2) {
      // Ajoute le nom de la formation à la liste des formations non commencées
      nonCommenceeFormations.push(formationDoc.name);
    } else {
      combinedPayments.push({
        apprenant: apprenant,
        formation: formation,
        tranches: [],
        totalAmount: formation.prix,
        montant_restant: formation.prix,
        status: 'not_paid'
      });
    }
  }
}

// Si plusieurs formations sont non commencées, afficher un message unique
if (nonCommenceeFormations.length > 0) {
  combinedPayments.push({
    success: false,
    message: `Les formations suivantes sont inscrites mais n'ont pas encore lancé car elles nécessitent des inscrits : ${nonCommenceeFormations.join(', ')}.`,
    formations: nonCommenceeFormations,
    apprenant: apprenant
  });
}






    // Toujours envoyer toutes les formations : celles payées + celles pas encore payées
    res.json(combinedPayments);

  } catch (error) {
    console.error('Error finding payments:', error);
    res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
  }
};




module.exports.getAllPayments = async (req, res) => {
  try {
    // Récupère tous les paiements avec les informations associées de l'apprenant et de la formation
    let payments = await Payment.find()
      .populate('apprenant', 'name email')
      .populate('formation', 'name prix') // récupérer les informations de la formation (ex. : nom, prix)
      .exec() // Exécute la requête

    // Si aucun paiement n'est trouvé, renvoyer un message
    if (payments.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: 'No payments found' })
    }

    // Renvoyer les paiements avec succès
    res.json({ success: true, payments })
  } catch (error) {
    // Gestion des erreurs serveur
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}
