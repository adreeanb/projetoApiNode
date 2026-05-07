const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

router.post('/register', userController.createUser);

router.post('/login', authController.login);

router.get('/users', userController.getAllUsers);

// Rota para buscar todos os usuários (engenheiros) do sistema
router.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      //select para garantir que a SENHA não seja enviada ao frontend!
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });
    res.status(200).json(users);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    res.status(500).json({ error: 'Erro ao buscar lista de engenheiros' });
  }
});

module.exports = router;