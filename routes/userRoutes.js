const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// Rota para registrar um novo usuário
router.post('/register', userController.registerUser);

// Rota para fazer login
router.post('/login', userController.loginUser);

// Rota para listar todos os usuários (admin)
router.get('/', authMiddleware, adminMiddleware, userController.getAllUsers);

// Rota para buscar um usuário por ID (usuario ou admin)
router.get('/:id', authMiddleware, userController.getUserInfo);

// Rota para atualizar um usuário (usuario ou admin)
router.put('/:id', authMiddleware, userController.updateUser);

// Rota para deletar um usuário (usuario ou admin)
router.delete('/:id', authMiddleware, userController.deleteUser);

// Rota para verificar se um e-mail está cadastrado (usuario ou admin)
router.post('/verify-email', authMiddleware, userController.verifyEmail);

module.exports = router;
