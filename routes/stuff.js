const express = require('express');
const router = express.Router();

const stuffCtrl = require('../controllers/stuff');
const auth = require('../middleware/auth');

// En ajoutant 'auth' avant les middleware, on oblige la requête a passer par ce middleware la avant, de sorte à checker le token
router.post(      '/', auth,  stuffCtrl.createThing);
router.put(    '/:id', auth,  stuffCtrl.modifyThing);
router.delete( '/:id', auth,  stuffCtrl.deleteThing);
router.get(    '/:id', auth,  stuffCtrl.getOneThing);
router.get(       '/', auth,  stuffCtrl.getAllThing);

module.exports = router;