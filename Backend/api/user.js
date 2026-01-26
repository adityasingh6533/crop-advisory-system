const express = require('express');
const { createUser, signInUser } = require('../Controllers/user');
const router = express.Router();

router.post('/', createUser);
router.post('/signin', signInUser);

module.exports = router;
