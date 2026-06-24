# Plateforme de gestion des formations

Application web de gestion d'un centre de formation. Le projet contient une interface frontend Angular et une API backend Node.js/Express connectée à MongoDB.

## Fonctionnalités

- Gestion des apprenants, formateurs et administrateurs
- Authentification avec rôles
- Gestion des formations, catégories, salles et sessions
- Suivi des paiements
- Gestion des avis
- Génération et consultation des certificats
- Envoi d'emails avec Nodemailer
- Chatbot et communication en temps réel avec Socket.io
- Upload de fichiers pour les profils, CVs, documents et certificats

## Technologies utilisées

### Backend

- Node.js
- Express.js
- MongoDB avec Mongoose
- JWT
- Bcrypt
- Nodemailer
- Multer
- Socket.io
- Dialogflow

### Frontend

- Angular 16
- Bootstrap
- Angular Material
- SweetAlert2
- RxJS
- Socket.io client

## Structure du projet

```text
.
├── backend/
│   ├── controllers/
│   ├── database/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── package.json
├── frontEnd/
│   ├── src/
│   ├── angular.json
│   └── package.json
└── README.md
```

## Installation

### 1. Cloner le projet

```bash
git clone https://github.com/Yasminesoussi/Plateforme-de-gestion-formations.git
cd Plateforme-de-gestion-formations
```

### 2. Installer le backend

```bash
cd backend
npm install
```

Créer un fichier `.env` dans le dossier `backend` :

```env
MONGODB_URI=votre_uri_mongodb
ACCESS_TOKEN_SECRET=votre_secret_jwt
USER_EMAIL=votre_email
USER_PASSWORD=votre_mot_de_passe_application
```

Lancer le backend :

```bash
npm start
```

Le serveur backend démarre sur :

```text
http://localhost:3000
```

### 3. Installer le frontend

Dans un autre terminal :

```bash
cd frontEnd
npm install
npm start
```

L'application frontend démarre sur :

```text
http://localhost:4200
```

## Variables d'environnement

Le fichier `.env` ne doit jamais être envoyé sur GitHub. Il contient les informations sensibles du projet.

Exemple de variables nécessaires :

| Variable | Description |
| --- | --- |
| `MONGODB_URI` | Lien de connexion MongoDB |
| `ACCESS_TOKEN_SECRET` | Clé secrète utilisée pour les tokens JWT |
| `USER_EMAIL` | Adresse email utilisée pour l'envoi des emails |
| `USER_PASSWORD` | Mot de passe d'application email |

## Scripts utiles

### Backend

```bash
npm start
```

### Frontend

```bash
npm start
npm run build
npm test
```

## Sécurité

Les fichiers suivants ne doivent pas être ajoutés au dépôt Git :

- `backend/.env`
- `backend/node_modules/`
- `backend/uploads/`
- `backend/routes/keys/`

Ces fichiers sont ignorés avec `.gitignore`.

## Auteur

Projet réalisé par Yasmine Soussi.
