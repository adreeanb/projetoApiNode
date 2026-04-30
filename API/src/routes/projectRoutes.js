const express = require('express');
const router = express.Router();

const projectController = require('../controllers/projectController');
const taskRoutes = require('./taskRoutes');
const projectMaterialRoutes = require('./projectMaterialRoutes');
const logRoutes = require('./logRoutes');

router.get('/', projectController.getAllProjects);

router.post('/', projectController.createProject);


router.get('/:projectId', projectController.getProjectById);

router.patch('/:projectId/status', projectController.updateProjectStatus);


router.use('/:projectId/tasks', taskRoutes);
router.use('/:projectId/materials', projectMaterialRoutes);
router.use('/:projectId/logs', logRoutes);

module.exports = router;