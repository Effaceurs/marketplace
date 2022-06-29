const express = require('express');
const router = express.Router();
const passport = require('passport')
const controller = require('../controllers/deployterraform');

router.post('/',passport.authenticate('jwt', {session: false}), controller.deploy);

module.exports = router;
