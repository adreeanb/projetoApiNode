const express = require('express');
const router = express.Router();

// Catálogo geral da empresa (não está preso a uma obra específica)
router.get('/', (req, res) => {
    res.status(200).json({ message: "Listando todos os insumos do catálogo da construtora" });
});

router.post('/', (req, res) => {
    const { name, unit, cost_per_unit } = req.body;
    res.status(201).json({ 
        message: "Novo material cadastrado no catálogo", 
        data: { name, unit, cost_per_unit } 
    });
});

module.exports = router;