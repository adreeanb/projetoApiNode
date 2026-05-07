const prisma = require('../lib/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        
        if (!user) {
            return res.status(401).json({ error: "E-mail ou senha inválidos." });
        }

        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        
        if (!passwordMatch) {
            return res.status(401).json({ error: "E-mail ou senha inválidos." });
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            user: { id: user.id, name: user.name, role: user.role },
            token
        });

    } catch (error) {
        console.error("ERRO NO LOGIN:", error);
        res.status(500).json({ error: "Erro ao realizar login." });
    }
};

module.exports = { login };