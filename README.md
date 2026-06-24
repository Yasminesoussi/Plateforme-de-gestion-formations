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


### 2. Installer le backend

```bash
cd backend
npm install
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

## Auteur

Projet réalisé par Yasmine Soussi.
