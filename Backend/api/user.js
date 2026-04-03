const express = require('express');
const { createUser, signInUser } = require('../Controllers/user');
const router = express.Router();
const auth = require('../middleware/auth');

router.post('/', createUser);
router.post('/signin', signInUser);
router.get('/profile', auth, (req, res) => {
    res.json({ message: 'User profile', user: req.user });
}); 
module.exports = router;
