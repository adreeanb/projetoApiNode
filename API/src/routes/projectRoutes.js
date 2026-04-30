const express = require('express');
const router = express.Router();

// Importação dos Controllers e Rotas Filhas
const projectController = require('../controllers/projectController');
const taskRoutes = require('./taskRoutes');
const projectMaterialRoutes = require('./projectMaterialRoutes');
const logRoutes = require('./logRoutes');

// ==========================================
// ROTAS PRINCIPAIS DE OBRAS
// ==========================================

// 1. GET: Lista todas as obras do banco
router.get('/', projectController.getAllProjects);

// 2. POST: Cria uma nova obra real no PostgreSQL
router.post('/', projectController.createProject);

// 3. GET: Busca os detalhes de UMA obra específica (Ainda usando mock)
router.get('/:projectId', projectController.getProjectById);

// 4. PATCH: Altera o status da obra (Ainda usando mock)
router.patch('/:projectId/status', projectController.updateProjectStatus);

// ==========================================
// CONEXÃO DAS ROTAS FILHAS
// ==========================================
// Qualquer requisição para essas URLs será repassada para os arquivos específicos
router.use('/:projectId/tasks', taskRoutes);
router.use('/:projectId/materials', projectMaterialRoutes);
router.use('/:projectId/logs', logRoutes);

module.exports = router;