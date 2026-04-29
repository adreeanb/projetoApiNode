const express = require('express');
const app = express();

// Middleware para entender JSON no body das requisições
app.use(express.json());

// Importando os arquivos de rotas
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const materialRoutes = require('./routes/materialRoutes');

// Registrando as rotas base
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/materials', materialRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});