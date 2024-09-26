const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Rota para registrar um novo usuário
router.post('/register', userController.registerUser);

// Rota para fazer login
router.post('/login', userController.loginUser);

module.exports = router;