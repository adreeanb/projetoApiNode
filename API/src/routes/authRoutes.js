const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

router.post('/register', userController.createUser);

router.post('/login', authController.login);

router.get('/users', userController.getAllUsers);

module.exports = router;