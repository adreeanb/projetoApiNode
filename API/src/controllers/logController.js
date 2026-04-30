const prisma = require('../lib/prisma');

const createLog = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { weather, workers_present, notes, user_id } = req.body;


        const log = await prisma.dailyLog.create({
            data: {
                project_id: projectId,
                user_id: user_id, 
                weather,
                workers_present,
                notes
            }
        });

        res.status(201).json({ message: "Diário de obras registrado com sucesso!", log });
    } catch (error) {
        console.error("Erro no createLog:", error);
        res.status(500).json({ error: "Erro ao registrar o diário de obras." });
    }
};

const getProjectLogs = async (req, res) => {
    try {
        const { projectId } = req.params;

        const logs = await prisma.dailyLog.findMany({
            where: { project_id: projectId },
            orderBy: { date: 'desc' } 
        });

        res.status(200).json(logs);
    } catch (error) {
        console.error("Erro no getProjectLogs:", error);
        res.status(500).json({ error: "Erro ao buscar o histórico do diário de obras." });
    }
};

module.exports = { createLog, getProjectLogs };