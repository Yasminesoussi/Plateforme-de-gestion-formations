const express = require('express');
const router = express.Router();
const dialogflow = require('dialogflow');
const path = require('path');
const { v4 } = require('uuid');
const Formation = require('../models/Formation'); // 🔁 importe le modèle Formation (⚠️ adapte le chemin si besoin)
const Formateur = require('../models/Formateur'); // 👈 Ajout import Formateur
const Categorie = require('../models/Category'); // 👈 Ajout import Formateur



// Charger la clé JSON de Dialogflow
const keyFilePath = path.join(__dirname, 'keys', 'maisondesavoirs-wrai-dbe125c53b68.json');
const sessionClient = new dialogflow.SessionsClient({
  keyFilename: keyFilePath,
});

// ID du projet Dialogflow
const projectId = 'maisondesavoirs-wrai';

// Route pour gérer les messages du chatbot
router.post('/chat', async (req, res) => {
  // 🔁 Récupérer le message et la session
  let { message, sessionId } = req.body;
  if (!sessionId) {
    sessionId = v4(); // Génère une nouvelle session si absente
  }

  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  // 📥 Crée la requête en fonction du message ou d’un event (WELCOME)
  let queryInput;
  if (message === '__welcome__') {
    queryInput = {
      event: {
        name: 'WELCOME',
        languageCode: 'fr',
      }
    };
  } else {
    queryInput = {
      text: {
        text: message,
        languageCode: 'fr',
      },
    };
  }

  const request = {
    session: sessionPath,
    queryInput,
  };

  try {
    // 📡 Appel à Dialogflow
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;

    // 🔍 Récupère le nom de l’intent détecté
    const intentName = result.intent.displayName;

    // 🧾 Réponse par défaut
    let textResponse = result.fulfillmentText;
    if (!textResponse || textResponse.trim() === '') {
      textResponse = "Je n'ai pas bien compris. Pouvez-vous reformuler ?";
    }

    // ✅ Si l’intent est "Formationdisponible", alors on va interroger MongoDB
    if (intentName === 'Formationdisponible') {
      try {
        const formations = await Formation.find().limit(5); // récupère max 5 formations

        if (formations.length === 0) {
          textResponse = "Aucune formation n'est disponible pour le moment.";
        } else {
          textResponse = "📚 Voici quelques formations disponibles :\n\n";
          textResponse += formations.map(f =>
            `- ${f.name} (${f.level}) ${f.prix} DT `
          ).join('\n');
        }
      } catch (err) {
        console.error('❌ Erreur DB :', err);
        textResponse = "Erreur lors de la récupération des formations.";
      }
    }


    // 👨‍🏫 Si intent = Formateurs disponibles → récupérer depuis MongoDB
    if (intentName === 'FormateurDisponible') {
      try {
        const formateurs = await Formateur.find({ status: 'active' }).limit(5);
        if (formateurs.length === 0) {
          textResponse = "Aucun formateur actif pour le moment.";
        } else {
          textResponse = "👨‍🏫 Formateurs disponibles :\n\n";
          textResponse += formateurs.map(f =>
            `- ${f.name} : ${f.specialite}`
          ).join('\n');
        }
      } catch (err) {
        console.error('❌ Erreur DB Formateurs :', err);
        textResponse = "Erreur lors de la récupération des formateurs.";
      }
    }




     // 👨‍🏫 Si intent = Categories disponibles → récupérer depuis MongoDB
     if (intentName === 'CategoriesDisponibles') {
      try {
        const categories = await Categorie.find().limit(5);
        if (categories.length === 0) {
          textResponse = "Aucun categorie disponible pour le moment.";
        } else {
          textResponse = "📊 Categories disponibles :\n\n";
          textResponse += categories.map(c =>
            `- ${c.name} : ${c.description}`
          ).join('\n');
        }
      } catch (err) {
        console.error('❌ Erreur DB Categories :', err);
        textResponse = "Erreur lors de la récupération des categories.";
      }
    }

    
  



    // 🎯 Suggestions (chips) si disponibles
    let suggestions = [];
    const messages = result.fulfillmentMessages;

    if (messages) {
      messages.forEach((msg) => {
        if (msg.payload && msg.payload.fields?.richContent) {
          const richContent = msg.payload.fields.richContent.listValue.values;

          richContent.forEach((contentList) => {
            const items = contentList.listValue?.values;
            if (items) {
              items.forEach((item) => {
                const struct = item.structValue;
                if (
                  struct?.fields?.type?.stringValue === 'chips' &&
                  struct?.fields?.options?.listValue?.values
                ) {
                  struct.fields.options.listValue.values.forEach((opt) => {
                    const text = opt.structValue?.fields?.text?.stringValue;
                    if (text) suggestions.push(text);
                  });
                }
              });
            }
          });
        }
      });
    }

    // 🔁 Renvoyer la réponse avec suggestions et sessionId
    res.json({ response: textResponse, suggestions, sessionId });

  } catch (error) {
    console.error('❌ Erreur avec Dialogflow :', error);
    res.status(500).json({ error: 'Erreur lors de la communication avec le chatbot' });
  }
});

module.exports = router;
