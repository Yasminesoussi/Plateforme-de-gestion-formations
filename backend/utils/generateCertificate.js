const { createCanvas, loadImage } = require('canvas');
const path = require('path');
const fs = require('fs');

async function generateCertificate(apprenant, session, formation) {
  // Chemin vers le template d'image
  const templatePath = path.join(__dirname, '../assets/certificate_template.png');

  // Charger le template
  const template = await loadImage(templatePath);

  // Créer canvas avec les dimensions du template
  const canvas = createCanvas(template.width, template.height);
  const ctx = canvas.getContext('2d');

  // Dessiner le template
  ctx.drawImage(template, 0, 0, template.width, template.height);

  // Style du texte
  ctx.font = '60px Arial';
  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';

  // Ajouter les textes dynamiques (à ajuster selon ton template)
  ctx.fillText(apprenant.name, template.width / 2, 600);
  ctx.fillText(formation.name, template.width / 2, 850);
  ctx.fillText(new Date(session.startDate).toLocaleDateString('fr-FR'), template.width / 2 - 600, 1100);
  ctx.fillText(new Date(session.endDate).toLocaleDateString('fr-FR'), template.width / 2 - 200, 1100);

  // Dossier uploads (assure-toi qu'il existe)
  const uploadsDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }

  // Nom fichier unique
  const fileName = `certif-${session._id}-${apprenant._id}.png`;
  const filePath = path.join(uploadsDir, fileName);

  // Sauvegarder le fichier image
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(filePath, buffer);

  // Retourne chemin relatif (pour le lien URL)
  return `/uploads/${fileName}`;
}

module.exports = generateCertificate;
