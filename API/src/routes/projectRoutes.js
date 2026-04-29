const express = require('express');
const router = express.Router();

// Importação das rotas aninhadas (dependentes de uma obra específica)
const taskRoutes = require('./taskRoutes');
const projectMaterialRoutes = require('./projectMaterialRoutes');
const logRoutes = require('./logRoutes');

// Rotas principais de Obras
router.get('/', (req, res) => {
    res.status(200).json({ message: "Listando todas as obras" });
});

router.post('/', (req, res) => {
    const { name, location, budget } = req.body;
    res.status(201).json({ message: "Obra criada com sucesso", data: { name, location, budget } });
});

router.get('/:projectId', (req, res) => {
    const { projectId } = req.params;
    res.status(200).json({ message: `Detalhes completos da obra ID: ${projectId}` });
});

router.patch('/:projectId/status', (req, res) => {
    const { projectId } = req.params;
    const { status } = req.body;
    res.status(200).json({ message: `Status da obra ${projectId} alterado para: ${status}` });
});

// Conectando as rotas filhas e repassando o :projectId
router.use('/:projectId/tasks', taskRoutes);
router.use('/:projectId/materials', projectMaterialRoutes);
router.use('/:projectId/logs', logRoutes);

module.exports = router;