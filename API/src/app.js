const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const materialRoutes = require('./routes/materialRoutes');
const authenticateToken = require('./middlewares/authMiddleware');



// Registrando as rotas base
app.use('/api/auth', authRoutes);
app.use('/api/projects', authenticateToken, projectRoutes);
app.use('/api/materials', materialRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});