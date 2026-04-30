const express = require('express');
const router = express.Router({ mergeParams: true });

const projectMaterialController = require('../controllers/projectMaterialController');

//Controller routes

router.post('/allocate', projectMaterialController.allocateMaterial);
router.patch('/consume', projectMaterialController.consumeMaterial);
router.get('/', projectMaterialController.getProjectMaterials);

module.exports = router;