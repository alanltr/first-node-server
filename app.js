const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Thing = require('./models/Things');

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

// ====================================================
//       CRUD model Thing | endpoint /api/stuff
// ====================================================

/**
 * Méthode POST
 */
app.post('/api/stuff', (req, res, next) => {
  // On supprime l'id généré par le front car MongoDB le génère auto
  delete req.body._id;

  const thing = new Thing({
    // On déverse la totalité des champs du model Thing
    ...req.body
  });

  // La méthode save est fournie par le modèle grace à mongoose
  thing.save() // Renvoi une promise
    .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
    .catch(error => res.status(400).json({ error }));
});

/**
 * Méthode PUT
 */
 app.put('/api/stuff/:id', (req, res, next) => {
   // 1er arg : l'id de l'objet à modifier
   // 2ème arg : le nouvel objet (donc avec les modifs a faire en base)
  Thing.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
});

/**
 * Méthode DELETE
 */
 app.delete('/api/stuff/:id', (req, res, next) => {
   // Arg : l'id de l'objet à supprimer
  Thing.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
    .catch(error => res.status(400).json({ error }));
});

/**
 * Méthode GET one by id
 */
app.get('/api/stuff/:id', (req, res, next) => {
  // On lui précise en argument que le paramétre d'URL ':id' doit etre l'id de la thing récupérée
  Thing.findOne({ _id: req.params.id })
    .then(thing => res.status(200).json(thing))
    .catch(error => res.status(404).json({ error }));
});

/**
 * Méthode GET all
 */
app.get('/api/stuff', (req, res, next) => {
  // La méthode find() est fournie par le modèle
  Thing.find()
    .then(things => res.status(200).json(things))
    .catch(error => res.status(400).json({ error }));
});

module.exports = app;