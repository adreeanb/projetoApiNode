const prisma = require('../lib/prisma');

const createTask = async (req, res) => {
    try {
        const { projectId } = req.params; // Vem da URL
        const { name, start_date, end_date } = req.body;

        const task = await prisma.task.create({
            data: {
                name,
                start_date: new Date(start_date),
                end_date: new Date(end_date),
                project_id: projectId
            }
        });

        res.status(201).json({ message: "Etapa adicionada ao cronograma", task });
    } catch (error) {
        res.status(500).json({ error: "Erro ao criar etapa." });
    }
};

const updateTaskProgress = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { progress_percentage } = req.body;

        let status = "EM_PROGRESSO";
        if (progress_percentage === 100) status = "CONCLUIDA";
        if (progress_percentage === 0) status = "PENDENTE";

        const task = await prisma.task.update({
            where: { id: taskId },
            data: { progress_percentage, status }
        });

        res.status(200).json({ message: "Progresso atualizado", task });
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar etapa." });
    }
};

module.exports = { createTask, updateTaskProgress };