const express = require('express');
const router = express.Router();

const stuffCtrl = require('../controllers/stuff');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// En ajoutant 'auth' avant les middleware, on oblige la requête a passer par ce middleware la avant, de sorte à checker le token
router.post(      '/', auth, multer,  stuffCtrl.createThing);
router.put(    '/:id', auth, multer,  stuffCtrl.modifyThing);
router.delete( '/:id', auth,          stuffCtrl.deleteThing);
router.get(    '/:id', auth,          stuffCtrl.getOneThing);
router.get(       '/', auth,          stuffCtrl.getAllThing);

module.exports = router;