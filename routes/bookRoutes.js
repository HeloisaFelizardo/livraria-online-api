const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const {upload} = require('../utils/multer');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// Rota para upload de livros
router.post('/upload', authMiddleware, upload, bookController.uploadBook);

// Rota para listar todos os livros
router.get('/', bookController.getAllBooks);

// Rota para buscar os dados do livro
router.get('/:id', bookController.getBookById);

// Rota para baixar o PDF do livro
router.get('/:id/download', authMiddleware, bookController.downloadBookPdf);

// Rota para atualizar um livro
router.put('/:id', authMiddleware, bookController.updateBook);

// Rota para deletar um livro
router.delete('/:id', authMiddleware, adminMiddleware, bookController.deleteBook);

module.exports = router;
