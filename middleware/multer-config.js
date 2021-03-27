// Fichier de configuration de multer
const multer = require('multer');

// Dictionnaire des TYPES MIME
// Vu qu'on a pas accès à l'extension d'origine du fichier on va la
// récupérer dans son mimetype et on exclut image/ en lui assigant une valeur
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpeg',
  'image/png': 'png',
};


// la fonction diskStorage() permet d'enregistrer en dur
const storage = multer.diskStorage({
  // l'objet de configuration donné à diskStorage attend :
  // 1. la destination du fichier
  destination: (req, file, callback) => {
    // On utilise la callback qui attend : 
    // I. null qui signifie qu'il n'y a pas eu d'erreur. 
    // II. Le nom du dossier ou on souhaite enregistrer les fichiers
    callback(null, 'images');
  },
  // 2. le nom du fichier à utiliser par multer. Pas possible d'utiliser celui d'origine
  //    car possibilité de doublons et donc de bugs
  filename: (req, file, callback) => {
    // On part de son nom d'origine et on remplace les espaces par des _
    // originalname récupère le nom d'origine du fichier
    // split() va créer un tableau avec chaque mot compris dans le fichier et donc eclure les espaces
    // join() va recréer une string en mettant un _ entre chaque entité du tableau
    const name = file.originalname.split(' ').join('_');
    // Renverra la case du dictionnaire des TYPES MIME qui correspont au type MIME du fichier envoyé
    const extension = MIME_TYPES[file.mimetype];
    // On utilise la callback qui attend : 
    // I. null qui signifie qu'il n'y a pas eu d'erreur. 
    // II. Le filename entier auquel on a ajouté un Date.now() pour un nom unique au maximum
    callback(null, name + Date.now() + '.' + extension);
  }
});

// On exporte en fournissant storage et en présisant avec single() qu'il s'agit d'un seul fichier
// et non pas un groupe de fichiers, l'argument 'image' explique a multer que les fichiers sont des
// images uniquement
module.exports = multer({ storage }).single('image');