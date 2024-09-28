const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// Rota para registrar um novo usuário
router.post('/register', userController.registerUser);

// Rota para fazer login
router.post('/login', userController.loginUser);

// Rota para listar todos os usuários - Somente Admin pode acessar
router.get('/', authMiddleware, adminMiddleware, userController.getAllUsers);

// Rota para buscar um usuário por ID
router.get('/:id', authMiddleware, userController.getUserInfo);

// Rota para atualizar um usuário
router.put('/:id', authMiddleware, userController.updateUser);

// Rota para deletar um usuário
router.delete('/:id', authMiddleware, userController.deleteUser);

module.exports = router;