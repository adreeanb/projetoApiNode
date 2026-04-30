const prisma = require('../lib/prisma');

const createProject = async (req, res) => {
    try {
        const { name, location, budget, engineer_id } = req.body;


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

const getProjectById = async (req, res) => {
    try {
        const { projectId } = req.params;
        
        const project = await prisma.project.findUnique({
            where: { id: projectId },
     
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

const updateProjectStatus = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { status } = req.body; 

        const project = await prisma.project.update({
            where: { id: projectId },
            data: { status }
        });

        res.status(200).json({ message: "Status atualizado com sucesso", project });
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar o status da obra." });
    }
};

module.exports = {
    createProject,
    getAllProjects,
    updateProjectStatus,
    getProjectById
};