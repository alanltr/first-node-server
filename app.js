const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Import des router, c'est eux qui contiennent nos méthodes du CRUD
const stuffRoutes = require('./routes/stuff');

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

// On envoi les requetes de la route api/stuff vers le router stuffRoutes, donc dans le fichier stuff.js
app.use('/api/stuff', stuffRoutes);

module.exports = app;