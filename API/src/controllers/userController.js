const prisma = require('../lib/prisma');

const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Nota: Em um ambiente real, NUNCA salvamos a senha em texto puro.
        // Futuramente usaremos uma biblioteca como o 'bcrypt' para criptografar (hashear) essa senha.
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password_hash: password, // Temporário, até implementarmos criptografia
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
            // Não retornamos a senha por segurança
            select: { id: true, name: true, email: true, role: true }
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar usuários." });
    }
};

module.exports = { createUser, getAllUsers };