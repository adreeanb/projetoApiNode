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

module.exports = {
    createProject,
    getAllProjects
};