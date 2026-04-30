const express = require('express');
const router = express.Router();

// Importa o controller de usuários
const userController = require('../controllers/userController');

// Rota simulada de login (vamos implementar de verdade no próximo passo com JWT)
router.post('/login', (req, res) => {
    res.status(200).json({ message: "Login em construção" });
});

// Rotas reais usando o Controller
router.post('/register', userController.createUser); // <-- O erro provavelmente estava aqui na linha 7
router.get('/users', userController.getAllUsers);

module.exports = router;