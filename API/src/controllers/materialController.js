const prisma = require('../lib/prisma');

const createMaterial = async (req, res) => {
    try {
        const { name, unit, cost_per_unit } = req.body;

        const material = await prisma.material.create({
            data: { name, unit, cost_per_unit }
        });

        res.status(201).json({ message: "Material adicionado ao catálogo", material });
    } catch (error) {
        res.status(500).json({ error: "Erro ao cadastrar material." });
    }
};

const getAllMaterials = async (req, res) => {
    try {
        const materials = await prisma.material.findMany();
        res.status(200).json(materials);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar materiais." });
    }
};

module.exports = { createMaterial, getAllMaterials };