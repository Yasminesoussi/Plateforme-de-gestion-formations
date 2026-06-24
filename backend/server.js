require('dotenv').config()
var adminRoute = require('./routes/AdminRoute');
const { Server } = require("socket.io");
var formateurRoute = require('./routes/formateurRoute');
var apprenantRoute = require('./routes/apprenantRoute');
var categoryRoute = require('./routes/categoryRoute');
var formationRoute = require('./routes/formationRoute');
var sessionRoute = require('./routes/sessionFormation');
var paymentRoute = require('./routes/paymentRoute');
var avisRoute = require('./routes/avisRoute');
var salleRoute = require('./routes/salleRoute');
var chatRoute = require('./routes/chatRoute');
var certificatRoute = require('./routes/certificatRoute');


var  bodyParser = require("body-parser");
const express = require('express')
const app = express()
const http = require('http');
const cors = require('cors');
require('./database/dbconfig')

const Session = require('./models/SessionFormation');

const server = http.createServer(app)


const io = new Server(server, {
  cors: {
    origin: "http://localhost:4200", // your frontend URL
    methods: ["GET", "POST", "PATCH"],
    credentials: true,
  },
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.use(cors({
  origin: "http://localhost:4200",
  credentials:true
}))
app.use("/uploads" , express.static("uploads"));
app.use('/admin', adminRoute)
app.use('/formateur', formateurRoute)
app.use('/apprenant', apprenantRoute)
app.use('/category', categoryRoute)
app.use('/formation', formationRoute)
app.use('/session', sessionRoute)
app.use('/payment', paymentRoute)
app.use('/chat', chatRoute)
app.use('/avis', avisRoute)
app.use('/salle', salleRoute)
app.use('/certificat', certificatRoute)
const adminConnections = new Map();

// Stocker la Map dans l'app pour accès global
app.set('adminConnections', adminConnections);

// server.js
io.on('connection', (socket) => {
  console.log('Nouvelle connexion Socket.io:', socket.id);

  socket.on('admin-auth', (adminId) => {
    if (!adminId) {
      console.error('Admin ID manquant dans admin-auth');
      return;
    }

    adminConnections.set(adminId, socket.id);
    console.log(`Admin ${adminId} authentifié (socket: ${socket.id})`);
    console.log('Admins actuellement connectés:', Array.from(adminConnections.keys()));
  });

  socket.on('disconnect', () => {
    // Optimisation du cleanup
    for (const [adminId, sockId] of adminConnections.entries()) {
      if (sockId === socket.id) {
        adminConnections.delete(adminId);
        console.log(`Admin ${adminId} déconnecté (socket: ${socket.id})`);
        break;
      }
    }
  });
});


const port = 3000
server.listen(port, () => {
  console.log('Server started on port ' + port)
})



//Étape 2 : Passer automatiquement de "planned" à "ongoing" quand la date arrive Tu as besoin d’un script qui vérifie régulièrement si une session doit changer de statut.

setInterval(async () => {
  const now = new Date();

  try {
    const sessionsToUpdate = await Session.find({
      status: 'planned',
      startDate: { $lte: now } // startDate atteinte
    });

    for (const session of sessionsToUpdate) {
      session.status = 'ongoing';
      await session.save();
      console.log(`🔄 Session "${session._id}" mise à jour vers "ongoing"`);
    }
  } catch (err) {
    console.error("Erreur lors de la mise à jour des sessions :", err);
  }
}, 60 * 1000); // toutes les 60 secondes