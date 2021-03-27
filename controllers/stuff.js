const Thing = require('../models/Thing');
const fs = require('fs'); // fs pour file system permet d'accéder au système de fichiers


// Méthode POST
exports.createThing = (req, res, next) => {
  // UPLOAD : vu qu'un un fichier est envoyé cela change le corps de la requête
  //          on a le corps de la requête sous forme de string, il faut donc
  //          le remettre en objet Js. 
  // req.body devient req.body.thing
  const thingObject = JSON.parse(req.body.thing);
  // On supprime l'id généré par le front car MongoDB le génère auto
  delete thingObject._id;

  const thing = new Thing({
    // On déverse la totalité des champs du model Thing
    ...thingObject,
    // Il faut specifier le chemin de l'Url car c'est multer qui le génère
    // On fournit le protocole (https, http)
    // On fournit l'hote (localhost:3000, 127.0.0.0 etc...)
    // On fournit le nom du dossier ou sont contenus les fichiers
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });

  // La méthode save est fournie par le modèle grace à mongoose
  thing.save() // Renvoi une promise
    .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
    .catch(error => res.status(400).json({ error }));
};

// Méthode PUT
exports.modifyThing = (req, res, next) => {
  // Pour la méthode PUT, il faut identifier si l'image est modifiée ou non,
  // s'il y a un fichier ou non.
  // Ternaire :
  const thingObject = req.file ? // Si req.file existe alors :
    { // On applique la même mécanique que pour POST
      ...JSON.parse(req.body.thing),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } /* Sinon on laisse req.body tel quel */ : { ...req.body };

  // 1er arg : l'id de l'objet à modifier
  // 2ème arg : le nouvel objet (donc avec les modifs a faire en base)
 Thing.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id })
   .then(() => res.status(200).json({ message: 'Objet modifié !'}))
   .catch(error => res.status(400).json({ error }));
};

// Méthode DELETE
exports.deleteThing = (req, res, next) => {
  // Avant de supprimer l'objet de la base on aller le chercher, pour avoir l'url de l'image
  // ce qui nous donnera le nom du fichier pour le supprimer ensuite
  Thing.findOne({ _id: req.params.id })
    .then(thing => {
      // Ici split() va récupérer uniquement le nom du fichier
      const filename = thing.imageUrl.split('/images')[1];
      // unlink() va supprimer le fichier
      // 1er arg : le chemin du fichier
      // 2eme arg : la callback, ici on place le DELETE en BDD
      fs.unlink(`images/${filename}`, () => {
        // Arg : l'id de l'objet à supprimer
        Thing.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
        .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

// Méthode GET one
exports.getOneThing = (req, res, next) => {
  // On lui précise en argument que le paramétre d'URL ':id' doit etre l'id de la thing récupérée
  Thing.findOne({ _id: req.params.id })
    .then(thing => res.status(200).json(thing))
    .catch(error => res.status(404).json({ error }));
};

// Méthode GET all
exports.getAllThing = (req, res, next) => {
  // La méthode find() est fournie par le modèle
  Thing.find()
    .then(things => res.status(200).json(things))
    .catch(error => res.status(400).json({ error }));
};