const Book = require('../models/Book');
const { fromPath } = require('pdf2pic');

// Função para fazer upload de um livro e extrair a capa
exports.uploadBook = async (req, res) => {
  const pdfFilePath = req.file.path;

  if (!pdfFilePath) {
    return res.status(400).json({ error: 'Nenhum arquivo PDF foi enviado.' });
  }

  const { title, author } = req.body;

  const newBook = new Book({
    title,
    author,
    pdfUrl: pdfFilePath
  });

  try {
    await newBook.save();
    res.status(201).json({ message: 'Livro salvo com sucesso!', book: newBook });
  } catch (error) {
    console.error('Erro ao salvar o livro no MongoDB:', error.message);
    res.status(500).json({ error: 'Erro ao salvar o livro no MongoDB.' });
  }
};

// Função para listar todos os livros
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar os livros.' });
  }
};

// Função para buscar um livro por ID
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    res.json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar o livro.' });
  }
};

// Função para atualizar um livro
exports.updateBook = async (req, res) => {
  try {
    const book = await Book.updateOne({ _id: req.params.id }, req.body);
    res.json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar o livro.' });
  }
};

// Função para deletar um livro
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.deleteOne({ _id: req.params.id });
    res.json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao deletar o livro.' });
  }
};
