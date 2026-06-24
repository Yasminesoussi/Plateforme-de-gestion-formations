require('dotenv').config()
const jwt = require("jsonwebtoken");
const Formateur = require("../models/Formateur");
const Apprenant = require("../models/Apprenant");


module.exports.verifyToken = () => {
    return async (req, res, next) => {
        try {
            // Vérifier si l'en-tête Authorization est présent
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ message: 'Unauthorized: No token provided' });
            }

            // Extraire le token
            const token = authHeader.split(' ')[1];

            // Vérifier le token JWT
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, userData) => {
                if (err) {
                    return res.status(401).json({ message: 'Invalid token' });
                }

                // Joindre les données utilisateur à la requête
                req.user = userData;

                // Passer au middleware suivant
                next();
            });

        } catch (error) {
            console.error('Token verification error:', error);
            res.status(401).json({ message: 'Invalid token' });
        }
    };
};




module.exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
      // Recherche d'un formateur ou d'un apprenant avec l'email donné
      const formateur = await Formateur.findOne({ email });
      const apprenant = await Apprenant.findOne({ email });

      if (!formateur && !apprenant) {
          return res.status(401).json({ message: 'Identifiants invalides' });
      }

      // Vérifier si le formateur existe et vérifier son statut
      if (formateur && formateur.status === 'inactive') {
          return res.status(401).json({ message: 'Votre compte formateur n\'est pas encore activé' });
      }

        // Vérifier si le formateur existe et vérifier son statut
        if (apprenant && apprenant.status === 'inactive') {
            return res.status(401).json({ message: 'Votre compte apprenant n\'est pas encore activé' });
        }

     
      // Choisir l'utilisateur (formateur ou apprenant)
      const user = formateur || apprenant;

      // Vérification du mot de passe
      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
          return res.status(401).json({ message: 'Identifiants invalides' });
      }

      // Création du token JWT
      const token = jwt.sign(
          { userId: user._id },
          `${process.env.ACCESS_TOKEN_SECRET}`,
          { expiresIn: '1h' }
      );

      return res.json({
          success: true,
          token: token,
          user
      });

  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};





