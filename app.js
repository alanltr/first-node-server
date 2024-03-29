const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

// Import des router
const stuffRoutes = require('./routes/stuff');
const userRoutes = require('./routes/user');

// Connexion avec la BDD
mongoose.connect('mongodb+srv://alan:lVAGdrM2KUiFqOk9@firstnodeserver.c4lpm.mongodb.net/Node?retryWrites=true&w=majority',
{ useNewUrlParser: true,
  useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((err) => console.log('Connexion à MongoDB échouée !', err));
  
const app = express();

// Gestion des CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());

// Middleware pour les requêtes d'images
// express.static() permet d'accéder à un dossier statique
// path est une méthode native node qui permet de récupérer le path 
// join() y ajoute le __dirname càd le nom du dossier dans lequel on va se trouver
//        et auquel on ajoute images. On a mtn le chemin complet du dossier images
app.use('/images', express.static(path.join(__dirname, 'images')));

// On envoi les requetes de la route api/stuff vers le router stuffRoutes, donc dans le fichier stuff.js
app.use('/api/stuff', stuffRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;