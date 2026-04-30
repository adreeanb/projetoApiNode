const prisma = require('../lib/prisma');

const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password_hash: password,
                role: role || "ENGINEER"
            }
        });

        res.status(201).json({ message: "Usuário criado com sucesso", user });
    } catch (error) {
        res.status(500).json({ error: "Erro ao criar usuário." });
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