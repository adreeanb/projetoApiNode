const prisma = require('../lib/prisma');

// Criar uma nova obra
const createProject = async (req, res) => {
    try {
        const { name, location, budget, engineer_id } = req.body;

        // O Prisma faz a inserção no banco automaticamente
        const project = await prisma.project.create({
            data: {
                name,
                location,
                budget,
                engineer_id, // Lembre-se: precisa ser o ID de um User real no banco
                status: "PLANEJAMENTO"
            }
        });

        res.status(201).json({ message: "Obra criada com sucesso!", project });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao criar a obra." });
    }
};

// Listar todas as obras
const getAllProjects = async (req, res) => {
    try {
        const projects = await prisma.project.findMany({
            include: {
                engineer: {
                    select: { name: true, email: true }
                }
            }
        });

        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar as obras." });
    }
};
// Adicione estas duas funções no seu projectController.js

// Buscar uma obra específica pelo ID
const getProjectById = async (req, res) => {
    try {
        const { projectId } = req.params;
        
        const project = await prisma.project.findUnique({
            where: { id: projectId },
            // O Prisma traz o Engenheiro e as Etapas (Tasks) dessa obra automaticamente!
            include: { 
                engineer: { select: { name: true, email: true } },
                tasks: true 
            }
        });

        if (!project) {
            return res.status(404).json({ error: "Obra não encontrada." });
        }

        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar detalhes da obra." });
    }
};

// Atualizar o status da obra
const updateProjectStatus = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { status } = req.body; // Ex: "ANDAMENTO", "CONCLUIDA"

        const project = await prisma.project.update({
            where: { id: projectId },
            data: { status }
        });

        res.status(200).json({ message: "Status atualizado com sucesso", project });
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar o status da obra." });
    }
};

// Não esqueça de exportar elas no final:
// module.exports = { createProject, getAllProjects, getProjectById, updateProjectStatus };
module.exports = {
    createProject,
    getAllProjects,
    updateProjectStatus,
    getProjectById
};