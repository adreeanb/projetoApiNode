const express = require('express');
// mergeParams: true é essencial aqui para acessar o :projectId do projectRoutes
const router = express.Router({ mergeParams: true });
const taskController = require('../controllers/taskController')

//taskController rotas

router.post('/', taskController.createTask)
router.patch('/:taskId/progress', taskController.updateTaskProgress)

router.get('/', (req, res) => {
    const { projectId } = req.params;
    res.status(200).json({ message: `Listando cronograma e etapas da obra ${projectId}` });
});

router.post('/', (req, res) => {
    const { projectId } = req.params;
    const { taskName, startDate, endDate } = req.body;
    res.status(201).json({ 
        message: `Nova etapa adicionada à obra ${projectId}`, 
        task: { taskName, startDate, endDate } 
    });
});

router.patch('/:taskId/progress', (req, res) => {
    const { projectId, taskId } = req.params;
    const { progress_percentage } = req.body;
    res.status(200).json({ 
        message: `Etapa ${taskId} da obra ${projectId} atualizada para ${progress_percentage}%` 
    });
});

module.exports = router;