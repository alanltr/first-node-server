const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
  User.findOne({ email: req.body.email})
    .then(user => {
      // Si l'utilisateur n'est pas trouvé :
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      // Si utilisateur trouvé : on compare le mdp non hashé avec celui hashé en BDD
      // Fonction Asynchrone | Renvoi un booléen nommé 'valid'
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          // Si mdp pas identiques
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect' });
          }
          // Si mdp identiques
          return res.status(200).json({ 
            // Ici les données qu'on renvoi au front
            userId: user._id,
            // La fonction sign() prend 3 arg :
            // 1er : les données qu'on souhaite encoder, le payload
            // 2ème : clé secète d'encodage (mettre une chaine longue et random pour la sécu++)
            // 3ème : délai d'expiration du token
            token: jwt.sign(
              { userId: user._id },
              'RANDOM_TOKEN_SECRET',
              { expiresIn: '24h' }
            )
          })
        })
        // Uniquement si erreur de connexion avec MongoDB | Erreur serveur
        .catch(error => res.status(500).json({ error }));
    })
    // Uniquement si erreur de connexion avec MongoDB | Erreur serveur
    .catch(error => res.status(500).json({ error }));
}