const conenection = require('../database/conenection');
const express = require('express');
const router = express.Router();
const ClienteController = require('../controllers/ClienteController');

router.post('/novoCliente',ClienteController.novoCliente);

module.exports = router;