const bcrypt = require('bcrypt');

const User = require('../models/User');

exports.signup = (req, res, next) => {
  // 1 . On hash le mdp, la fonction est asynchrone
  // (1er arg : le mdp à hasher)
  // (2eme arg : le nb de fois ou on va faire tourner l'algo de hash, + c'est long + c'est secure)
  bcrypt.hash(req.body.password, 10)
  .then(hash => {
      // 1.1 . Lorsqu'on a la réponse, on instancie un user en lui injectant ses données
      const user = new User({
        email: req.body.email,
        password: hash
      });
      // 2. On enregistre l'utilisateur en base
      user.save()
        // 2.1 . Si l'enregistrement est un succès, on avertit le front
        .then(() => res.status(201).json({ message: 'Utilisateur créé!' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
  
}

exports.login = (req, res, next) => {

}