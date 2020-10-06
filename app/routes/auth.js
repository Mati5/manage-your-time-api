const router = require('express').Router();
const { createUser, signIn, logout } = require('../controllers/authController');

router.post('/register', createUser);
router.post('/signIn', signIn);
router.post('/logout', logout);

module.exports = router;