const Thing = require('../models/Thing');


// Méthode POST
exports.createThing = (req, res, next) => {
  // UPLOAD : si un fichier est envoyé cela change le corps de la requête
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
    // On fournit l'hote (localhost, 127.0.0.0 etc...)
    // On fournit le nom du dossier ou sont contenus les fichiers
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });

  // La méthode save est fournie par le modèle grace à mongoose
  thing.save() // Renvoi une promise
    .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
    .catch(error => res.status(400).json({ error }));
}

// Méthode PUT
exports.modifyThing = (req, res, next) => {
  // 1er arg : l'id de l'objet à modifier
  // 2ème arg : le nouvel objet (donc avec les modifs a faire en base)
 Thing.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
   .then(() => res.status(200).json({ message: 'Objet modifié !'}))
   .catch(error => res.status(400).json({ error }));
}

// Méthode DELETE
exports.deleteThing = (req, res, next) => {
  // Arg : l'id de l'objet à supprimer
 Thing.deleteOne({ _id: req.params.id })
   .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
   .catch(error => res.status(400).json({ error }));
}

// Méthode GET one
exports.getOneThing = (req, res, next) => {
  // On lui précise en argument que le paramétre d'URL ':id' doit etre l'id de la thing récupérée
  Thing.findOne({ _id: req.params.id })
    .then(thing => res.status(200).json(thing))
    .catch(error => res.status(404).json({ error }));
}

// Méthode GET all
exports.getAllThing = (req, res, next) => {
  // La méthode find() est fournie par le modèle
  Thing.find()
    .then(things => res.status(200).json(things))
    .catch(error => res.status(400).json({ error }));
}



// Méthode POST avant UPLOAD
// exports.createThing = (req, res, next) => {
  
//   // On supprime l'id généré par le front car MongoDB le génère auto
//   delete req.body._id;

//   const thing = new Thing({
//     // On déverse la totalité des champs du model Thing
//     ...req.body
//   });

//   // La méthode save est fournie par le modèle grace à mongoose
//   thing.save() // Renvoi une promise
//     .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
//     .catch(error => res.status(400).json({ error }));
// }


// Méthode PUT avant UPLOAD
// exports.modifyThing = (req, res, next) => {
//   // 1er arg : l'id de l'objet à modifier
//   // 2ème arg : le nouvel objet (donc avec les modifs a faire en base)
//  Thing.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
//    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
//    .catch(error => res.status(400).json({ error }));
// }