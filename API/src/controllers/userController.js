const prisma = require('../lib/prisma');
const bcrypt = require('bcryptjs'); 

const createUser = async (req, res) => {
    try {

        const { name, email, password, role } = req.body;

        if (!password) {
            return res.status(400).json({ error: "A senha é obrigatória no corpo da requisição." });
        }

        const userExists = await prisma.user.findUnique({ where: { email } });
        if (userExists) {
            return res.status(400).json({ error: "Este e-mail já está cadastrado." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password_hash: hashedPassword, 
                role: role || 'USER'
            }
        });

        const { password_hash: _, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);

    } catch (error) {
        console.error("Erro detalhado no Cadastro:", error);
        res.status(500).json({ error: "Erro interno ao criar usuário." });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, name: true, email: true, role: true }
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar usuários." });
    }
};

module.exports = { createUser, getAllUsers };