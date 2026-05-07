const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const router = express.Router();
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

router.get('/stats', async (req, res) => {
  try {
    // 1. Média de Progresso (calculada pelas Tarefas)
    const tasks = await prisma.task.findMany({
      select: { progress_percentage: true }
    });
    const avgProgress = tasks.length > 0 
      ? (tasks.reduce((acc, t) => acc + t.progress_percentage, 0) / tasks.length).toFixed(0)
      : 0;

    // 2. Tarefas Pendentes
    const pendingTasks = await prisma.task.count({
      where: { status: 'PENDENTE' } 
    });

    // 3. Alertas de Estoque (Materiais onde o uso está próximo ou passou do planejado)
    const projectMaterials = await prisma.projectMaterial.findMany({
      include: { material: true } 
    });

    // Lógica: Se usou 80% ou mais do planejado, entra em alerta crítico
    const alerts = projectMaterials
      .filter(pm => pm.quantity_used >= (pm.quantity_planned * 0.8))
      .map(pm => ({
        name: pm.material.name,
        available: `${pm.quantity_planned - pm.quantity_used} ${pm.material.unit}`,
        status: 'Crítico'
      }));

    // Envia o payload exato que o Frontend está esperando
    res.json({
      avgProgress: `${avgProgress}%`,
      pendingTasks: pendingTasks,
      criticalCount: alerts.length,
      stockAlerts: alerts.slice(0, 3) // Mostra apenas os 3 mais urgentes
    });
  } catch (error) {
    console.error("Erro no dashboard:", error);
    res.status(500).json({ error: "Erro ao processar dados" });
  }
});

module.exports = router;