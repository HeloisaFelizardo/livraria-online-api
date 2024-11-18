const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { upload } = require('../utils/multer');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// Rota para upload de livros (user e admin)
router.post('/upload', authMiddleware, upload, bookController.uploadBook);

// Rota para listar todos os livros
router.get('/', bookController.getAllBooks);

// Rota para buscar livros pelo título
router.get('/search', bookController.searchBooks);

// Rota para buscar os dados de um livro
router.get('/:id', bookController.getBookById);

// Rota para baixar o PDF do livro (user e admin)
router.get('/:id/download', authMiddleware, bookController.downloadBookPdf);

// Rota para atualizar um livro (user e admin)
router.patch('/:id', authMiddleware, upload, bookController.updateBook);

// Rota para deletar um livro (admin)
router.delete('/:id', authMiddleware, adminMiddleware, bookController.deleteBook);

module.exports = router;
