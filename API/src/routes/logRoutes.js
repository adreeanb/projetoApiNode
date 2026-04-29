const express = require('express');
const router = express.Router({ mergeParams: true });

router.get('/', (req, res) => {
    const { projectId } = req.params;
    res.status(200).json({ message: `Histórico do Diário de Obras da obra ${projectId}` });
});

router.post('/', (req, res) => {
    const { projectId } = req.params;
    const { date, weather, notes, workers_present } = req.body;
    res.status(201).json({ 
        message: `Diário de obras registrado para o projeto ${projectId}`, 
        log: { date, weather, workers_present, notes } 
    });
});

module.exports = router;