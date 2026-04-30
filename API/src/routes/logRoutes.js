const express = require('express');

const router = express.Router({ mergeParams: true });

const logController = require('../controllers/logController');


router.post('/', logController.createLog);


router.get('/', logController.getProjectLogs);

module.exports = router;