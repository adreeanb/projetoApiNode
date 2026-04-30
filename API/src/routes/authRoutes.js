const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

router.post('/login', (req, res) => {
    res.status(200).json({ message: "Login em construção" });
});

// Rotas Controller
router.post('/register', userController.createUser); 
router.get('/users', userController.getAllUsers);

module.exports = router;