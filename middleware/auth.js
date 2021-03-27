const jwt = require('jsonwebtoken');

// Chaque requête sur une route protégée par JWT passera sur cette route en premier

module.exports = (req, res, next) => {
  try {
    // Ici on veut récupérer uniquement le token et enlever le mot bearer, avec le ' ' on split aux espaces et avec le [1] on prend l'index 1, donc le token seul
    const token = req.headers.authorization.split(' ')[1];

    // On décode le token en fournissant le token récupérer et la clé secète d'encodage codée dans le user controller | Retourne un objet Js
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');

    // On récupère l'id décodé (en clair)
    const userId = decodedToken.userId;

    // Si on a un id dans la requete et que celui ci est différent de userId
    if (req.body.userId && req.body.userId !== userId) {
      // Throw permet de renvoyer l'erreur au catch
      throw 'User ID non valable'
    } else {
      // Tout s'est bien passé on envoi au prochain middleware qui traitera la requête
      next();
    }

  } catch (error) {
    // Condition : si on recoit une erreur on l'affiche SINON "|" on affiche 'Requête non authentifiée !'
    res.status(401).json({ error: error | 'Requête non authentifiée !' });
  }
}