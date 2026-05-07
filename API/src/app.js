const express = require('express');
const cors = require('cors');

// Importando os middlewares
const authenticateToken = require('./middlewares/authMiddleware');

// Importando as rotas
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const materialRoutes = require('./routes/materialRoutes');
const dbRoutes = require('./routes/dbRoutes');

const app = express();

// Configurações globais
app.use(cors());
app.use(express.json());

// Registrando as rotas base
// O authenticateToken protege a rota de projetos, exigindo login
app.use('/api/auth', authRoutes);
app.use('/api/projects', authenticateToken, projectRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/dashboard', dbRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});