const express = require('express');
const router = express.Router({ mergeParams: true });

router.get('/', (req, res) => {
    const { projectId } = req.params;
    res.status(200).json({ message: `Listando estoque atual e orçamento de materiais da obra ${projectId}` });
});

router.post('/allocate', (req, res) => {
    const { projectId } = req.params;
    const { materialId, quantity_planned } = req.body;
    res.status(201).json({ 
        message: `Material ${materialId} alocado para a obra ${projectId}. Quantidade: ${quantity_planned}` 
    });
});

router.post('/consume', (req, res) => {
    const { projectId } = req.params;
    const { materialId, quantity_used } = req.body;
    res.status(200).json({ 
        message: `Baixa de estoque na obra ${projectId}. Material ${materialId} consumido: ${quantity_used}` 
    });
});

module.exports = router;