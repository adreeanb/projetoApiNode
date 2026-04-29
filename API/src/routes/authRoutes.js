const express = require('express');
const router = express.Router();

const projectController = require('../controllers/userController');
//Rotas do userController

router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);

// POST /api/auth/login -> Faz o login e retorna um token
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    res.status(200).json({ message: "Login realizado com sucesso", token: "jwt_token_simulado" });
});

// POST /api/auth/register -> Cria um novo usuário
router.post('/register', (req, res) => {
    const { name, email, role } = req.body;
    res.status(201).json({ message: "Usuário criado", data: { name, email, role } });
});

// GET /api/auth/users -> Lista os usuários do sistema
router.get('/users', (req, res) => {
    res.status(200).json({ message: "Lista de usuários (Engenheiros, Admin, etc)" });
});

module.exports = router;