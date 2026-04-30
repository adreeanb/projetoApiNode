const prisma = require('../lib/prisma');

// Alocar um material do catálogo para uma obra específica
const allocateMaterial = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { material_id, quantity_planned } = req.body;

        const allocation = await prisma.projectMaterial.create({
            data: {
                project_id: projectId,
                material_id: material_id,
                quantity_planned
            }
        });

        res.status(201).json({ message: "Material alocado para a obra", allocation });
    } catch (error) {
        res.status(500).json({ error: "Erro ao alocar material." });
    }
};

// Registrar o consumo diário de um material na obra
const consumeMaterial = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { material_id, quantity_used } = req.body;

        // Primeiro, precisamos encontrar o registro dessa alocação para atualizar
        // O Prisma usa findFirst para buscar pela combinação de Obra + Material
        const allocation = await prisma.projectMaterial.findFirst({
            where: { project_id: projectId, material_id: material_id }
        });

        if (!allocation) {
            return res.status(404).json({ error: "Material não alocado para esta obra." });
        }

        // Atualiza a quantidade consumida (somando o que já foi usado com o uso de hoje)
        const updatedAllocation = await prisma.projectMaterial.update({
            where: { id: allocation.id },
            data: {
                quantity_used: allocation.quantity_used + quantity_used
            }
        });

        res.status(200).json({ message: "Baixa de estoque registrada", updatedAllocation });
    } catch (error) {
        res.status(500).json({ error: "Erro ao registrar consumo." });
    }
};

// Adicione esta função junto com as outras no seu projectMaterialController.js
const getProjectMaterials = async (req, res) => {
    try {
        const { projectId } = req.params;
        
        const stock = await prisma.projectMaterial.findMany({
            where: { project_id: projectId },
            include: { 
                material: true // Isso faz o Prisma trazer o Nome e a Unidade do material junto!
            }
        });

        res.status(200).json(stock);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar o estoque da obra." });
    }
};

module.exports = { allocateMaterial, consumeMaterial, getProjectMaterials };