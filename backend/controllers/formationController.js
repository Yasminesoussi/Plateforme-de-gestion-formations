const Category = require('../models/Category')
const Formation = require('../models/Formation')
const Apprenant = require('../models/Apprenant')
const Review = require("../models/Review")
var mongoose = require('mongoose');
const Formateur = require('../models/Formateur');
module.exports.addFormation = async (req, res) => {
  const { name, description, category, prix, tags, level, startDate, endDate } = req.body;

  try {
    // Vérifier si la catégorie existe
    const categoryfind = await Category.findById(category);
    if (!categoryfind) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Vérifier si les dates sont valides
    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({ message: 'La date de début ne peut pas être postérieure à la date de fin.' });
    }

    // Vérifier si une image est téléversée
    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const imageName = req.file.filename;
    const imagePath = req.file.path;

    const formation = new Formation({
      name,
      description,
      prix,
      category,
      tags: tags ? tags.split(',') : [],
      level,
      image: {
        name: imageName,
        path: imagePath
      },
      startDate,
      endDate
    });

    categoryfind.count = (categoryfind.count || 0) + 1;

    await formation.save();
    await categoryfind.save();

    res.status(201).json({ message: 'Formation créée avec succès', formation });
  } catch (error) {
    console.error('Erreur lors de la création de la formation:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

module.exports.updateFormation = async (req, res) => {
  const { id } = req.params // Récupérer l'ID de la formation à mettre à jour
  const { name, description, category, prix, startDate, endDate } = req.body // Données mises à jour

  try {
    // Vérifier si la formation existe
    const formation = await Formation.findById(id)
    if (!formation) {
      return res.status(404).json({ message: 'Formation not found' })
    }

    // Vérifier si la catégorie existe
    const categoryfind = await Category.findById(category)
    if (!categoryfind) {
      return res.status(404).json({ message: 'Category not found' })
    }

    // Mettre à jour la formation
    formation.name = name
    formation.description = description
    formation.prix = prix
    formation.category = categoryfind._id // Associer l'ID de la catégorie trouvée
    formation.startDate = startDate
    formation.endDate = endDate
    // Sauvegarder les modifications
    await formation.save()

    res.json({ message: 'Training updated successfully', formation })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports.searchTraining = async (req, res) => {
  const { query, minPrice, maxPrice, tags, categories, levels } = req.query;
  const searchQuery = {};

  console.log('Query reçue :', req.query); 

  if (query) {
    searchQuery.$or = [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } }
    ];
  }

  //filtre par categorie(cles etrangere)
  if (categories) {
    const categoriesArray = Array.isArray(categories) 
      ? categories 
      : categories.split(",");
    searchQuery.category = { $in: categoriesArray };
  }

  //Filtre par niveau
  if (levels) {
    const levelsArray = Array.isArray(levels) 
      ? levels 
      : levels.split(",");
    searchQuery.level = { $in: levelsArray };
  }

  if (minPrice || maxPrice) {
    searchQuery.prix = {};
    if (minPrice) searchQuery.prix.$gte = Number(minPrice);
    if (maxPrice) searchQuery.prix.$lte = Number(maxPrice);
  }

  if (tags) {
    searchQuery.tags = { $in: tags.split(',') };
  }

  console.log('searchQuery construit :', searchQuery); // 👈 debug

  try {
    const formations = await Formation.find(searchQuery).populate('category','name');
    res.json(formations);
  } catch (err) {
    console.error("Erreur :", err);
    res.status(500).json({ message: err.message });
  }
};




module.exports.getById = async (req, res) => {
  const { id } = req.params;
  try {
    // Récupérer la formation avec le formateur
    const formation = await Formation.findById(id).populate('formateur')  .populate('category', 'name');

    if (!formation) {
      return res.status(404).json({ message: 'Formation non trouvée' });
    }

    // Si la formation est trouvée, renvoie-la avec ses données
    res.json({
      _id: formation._id,
      name: formation.name,
      description: formation.description,
      prix: formation.prix,
      image: formation.image, // L'image de la formation
      formateur: formation.formateur, // Le formateur associé à la formation
      category: formation.category, // ← ajoute cette ligne !
      likesCount: formation.likesCount,
      level:  formation.level, // Le formateur associé à la formation
      startDate: formation.startDate,
      endDate: formation.endDate
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};





module.exports.SupprimerFormation = async (req, res) => {
  try {
    const { formationId } = req.params;

    // 1. Vérifier si la formation existe
    const formation = await Formation.findById(formationId);
    if (!formation) {
      return res.status(404).json({ message: 'Formation non trouvée' });
    }

    // 2. Décrémenter le compteur de la catégorie
    const category = await Category.findById(formation.category);
    if (category) {
      category.count = Math.max(0, category.count - 1);
      await category.save();
    }

    // 3. Retirer la formation du formateur concerné
    await Formateur.updateOne(
      { formations: formationId },
      { $pull: { formations: formationId } }
    );

    // 4. Supprimer la formation
    await formation.deleteOne();

    res.json({ message: 'Formation supprimée avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};



module.exports.getFormationByCategory = async (req, res) => {
  try {
    const category = req.params.category
    let formations
    //  if(category==="null"){
    //if categroy null , find formation with null category
    formations = await Formation.find({ category: null })

    //}else{
    //find formation de cette categorie
    formations = await Formation.find({ category: category })

    .populate('category')
    .populate('formateur')
    //}

    // Retourner les formations trouvées
    res.json(formations)
  } catch (error) {
    console.error(error) // En cas d'erreur, loggons l'erreur
    res.status(500).json({ message: 'Erreur interne du serveur' })
  }
}

module.exports.getAllFormation = async (req, res) => {
  try {
    //recup tous formatios de database
    const formations = await Formation.find()
      .populate('category')
      .populate('formateur')
      .populate('apprenants')
    res.json(formations)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'internal server error' })
  }
}



module.exports.likeFormation = async (req, res) => {
  const { formationId, apprenantId } = req.params;

  // Validation des IDs
  if (
    !mongoose.Types.ObjectId.isValid(formationId) ||
    !mongoose.Types.ObjectId.isValid(apprenantId)
  ) {
    return res.status(400).json({ message: "Invalid ID format." });
  }

  try {
    const [formation, apprenant] = await Promise.all([
      Formation.findById(formationId),
      Apprenant.findById(apprenantId),
    ]);

    if (!formation) {
      return res.status(404).json({ message: "Training not found." });
    }
    if (!apprenant) {
      return res.status(404).json({ message: "Apprenant not found." });
    }

    // Vérifier si l'utilisateur a déjà liké
    const existingLike = await Review.findOne({
      formation: formationId,
      user: apprenantId,
    });

    if (existingLike) {
      return res
        .status(400)
        .json({ message: "Training already liked by this user." });
    }

    // Créer et sauvegarder le like
    const newLike = new Review({
      user: apprenantId,
      formation: formationId,
      isLike: true,
    });

    await newLike.save();

    // Mettre à jour le compteur
    await Formation.findByIdAndUpdate(formationId, {
      $inc: { likesCount: 1 },
    });

    return res.status(201).json({
      message: "Training liked successfully.",
      likeId: newLike._id,
    });
  } catch (error) {
    console.error("Error liking training:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};

module.exports.dislikeFormation = async (req, res) => {
  const { formationId, apprenantId } = req.params;

  // Validation des IDs
  if (
    !mongoose.Types.ObjectId.isValid(formationId) ||
    !mongoose.Types.ObjectId.isValid(apprenantId)
  ) {
    return res.status(400).json({ message: "Invalid ID format." });
  }

  try {
    const like = await Review.findOneAndDelete({
      user: apprenantId,
      formation: formationId,
    });

    if (!like) {
      return res.status(404).json({ message: "Like not found." });
    }

    await Formation.findByIdAndUpdate(formationId, {
      $inc: { likesCount: -1 },
    });

    return res.json({
      message: "Training unliked successfully",
      unlikeId: like._id,
    });
  } catch (error) {
    console.error("Error unliking training:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};



module.exports.getFormationsWithLikes = async (req, res) => {
  try {
    // Récupérer les likes avec les infos de la formation et de l'utilisateur
    const reviews = await Review.find({ isLike: true })
      .populate("formation", "name")
      .populate("user", "name");

    // Regrouper les likes par formation, en vérifiant que formation et user existent
    const grouped = reviews.reduce((acc, review) => {
      // On ignore les reviews sans formation ou sans utilisateur
      if (!review.formation || !review.user) return acc;

      const formationId = review.formation._id.toString();

      if (!acc[formationId]) {
        acc[formationId] = {
          formation: review.formation.name,
          likes: [],
        };
      }

      acc[formationId].likes.push(review.user.name);

      return acc;
    }, {});

    // Transformer les données pour l'affichage
    const data = Object.entries(grouped).map(([id, item], index) => ({
      id: index + 1,
      formation: item.formation,
      likedBy: item.likes.join(", "),
      likesCount: item.likes.length,
    }));

    return res.status(200).json(data);
  } catch (error) {
    console.error("Erreur lors de la récupération des likes:", error);
    return res.status(500).json({
      message: "Erreur serveur",
      details: error.message,
    });
  }
};



