const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { upload } = require('../utils/multer');
const authMiddleware = require('../middlewares/authMiddleware');

// Rota para upload de livros
router.post('/upload', authMiddleware, upload, bookController.uploadBook);

// Rota para listar todos os livros
router.get('/', bookController.getAllBooks);

// Rota para buscar um livro por ID
router.get('/:id', bookController.getBookById);

// Rota para atualizar um livro
router.put('/:id', authMiddleware,  bookController.updateBook);

// Rota para deletar um livro
router.delete('/:id', authMiddleware, bookController.deleteBook);

module.exports = router;