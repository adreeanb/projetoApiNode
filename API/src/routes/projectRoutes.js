const express = require('express');
const router = express.Router();
const prisma = require('../prisma'); 

const projectController = require('../controllers/projectController');
const taskRoutes = require('./taskRoutes');
const projectMaterialRoutes = require('./projectMaterialRoutes');
const logRoutes = require('./logRoutes');

// --- 1. ROTAS FIXAS OU ESPECÍFICAS ---
router.get('/', projectController.getAllProjects);
router.post('/', projectController.createProject);

// --- 2. ROTAS DE TAREFAS ---

router.put('/tasks/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    const { name, status, progress_percentage } = req.body;
    const idToFind = isNaN(taskId) ? taskId : parseInt(taskId);

    const updatedTask = await prisma.task.update({
      where: { id: idToFind },
      data: {
        name,
        status,
        progress_percentage: parseInt(progress_percentage)
      }
    });
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar tarefa" });
  }
});

router.delete('/tasks/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    const idToFind = isNaN(taskId) ? taskId : parseInt(taskId);
    await prisma.task.delete({ where: { id: idToFind } });
    res.json({ message: "Tarefa removida" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir tarefa" });
  }
});

// --- 3. ROTAS DE MATERIAIS (ALINHADAS AO SCHEMA) ---

// LISTAR MATERIAIS DA OBRA
router.get('/:id/materials/list', async (req, res) => {
  try {
    const { id } = req.params;
    const materials = await prisma.projectMaterial.findMany({
      where: { project_id: id },
      include: {
        material: true // Traz os dados do catálogo (nome, unidade, custo)
      }
    });
    res.json(materials);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar materiais" });
  }
});

// ADICIONAR MATERIAL À OBRA
router.post('/:id/materials/add', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, quantity_planned, unit, cost_per_unit } = req.body;

    // 1. Busca ou cria o material no catálogo global pelo nome
    let material = await prisma.material.findFirst({ where: { name: name } });
    
    if (!material) {
      material = await prisma.material.create({
        data: {
          name,
          unit: unit || 'UN',
          cost_per_unit: parseFloat(cost_per_unit) || 0
        }
      });
    }

    // 2. Vincula o material à obra específica
    const projectUsage = await prisma.projectMaterial.create({
      data: {
        project_id: id,
        material_id: material.id,
        quantity_planned: parseInt(quantity_planned) || 0,
        quantity_used: 0
      },
      include: { material: true }
    });

    res.status(201).json(projectUsage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao adicionar material" });
  }
});

// EXCLUIR VÍNCULO DE MATERIAL
router.delete('/materials/:materialId', async (req, res) => {
  try {
    const { materialId } = req.params;
    await prisma.projectMaterial.delete({
      where: { id: materialId }
    });
    res.json({ message: "Material removido da obra" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir material" });
  }
});

// --- 4. ROTAS DINÂMICAS DE OBRA ---

router.get('/:projectId', projectController.getProjectById);
router.patch('/:projectId/status', projectController.updateProjectStatus);

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, budget, start_date, end_date, engineer_id } = req.body;
    const updated = await prisma.project.update({
      where: { id: id },
      data: {
        name,
        location,
        budget: parseFloat(budget) || 0,
        start_date: start_date ? new Date(start_date) : null,
        end_date: end_date ? new Date(end_date) : null,
        engineer_id
      }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar obra" });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Delete em cascata manual para materiais e tarefas
    await prisma.projectMaterial.deleteMany({ where: { project_id: id } });
    await prisma.task.deleteMany({ where: { project_id: id } });
    await prisma.project.delete({ where: { id: id } });
    res.json({ message: "Obra excluída com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir obra" });
  }
});

router.post('/:id/tasks', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status, progress_percentage } = req.body;
    const newTask = await prisma.task.create({
      data: {
        name,
        status: status || 'PENDENTE',
        progress_percentage: parseInt(progress_percentage) || 0,
        project_id: id 
      }
    });
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: "Erro interno ao criar a tarefa" });
  }
});

// --- 5. SUB-ROTAS ---
router.use('/:projectId/tasks', taskRoutes);
router.use('/:projectId/materials', projectMaterialRoutes);
router.use('/:projectId/logs', logRoutes);

module.exports = router;