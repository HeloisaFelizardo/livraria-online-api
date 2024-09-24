const Book = require('../models/Book');
const path = require('path');

// Função para fazer upload de um livro e extrair a capa
exports.uploadBook = async (req, res) => {
  console.log('Requisição recebida para upload');

// Verifica se ambos os arquivos foram enviados
  if (!req.files || !req.files['pdf'] || !req.files['cover']) {
    return res.status(400).json({ error: 'Arquivos PDF e capa são obrigatórios.' });
  }

  // Obtém os caminhos dos arquivos enviados
  const pdfFilePath = path.resolve(req.files['pdf'][0].path);  // PDF da pasta uploads/
  const coverFilePath = path.resolve(req.files['cover'][0].path);  // Capa na pasta uploads/covers/

  try {
    const { title, author, description } = req.body;

    const newBook = new Book({
      title,
      author,
      description,
      pdfUrl: pdfFilePath,
      coverUrl: coverFilePath,
    });

    // Salva o livro no MongoDB
    await newBook.save();
    console.log('Livro salvo no MongoDB:', newBook);

    res.status(201).json({
      message: 'Livro salvo com sucesso!',
      book: newBook,
    });
  } catch (error) {
    console.error('Erro ao salvar o livro no MongoDB:', error);
    res.status(500).json({ error: 'Erro ao salvar o livro no MongoDB.' });
  }
};

// Função para listar todos os livros
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(201).json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Erro ao buscar os livros.'});
  }
};

// Função para buscar um livro por ID
exports.getBookById = async (req, res) => {
  try {
    // Buscando o livro pelo ID
    const book = await Book.findById(req.params.id);

    // Verificando se o livro existe
    if (!book) {
      return res.status(404).json({ error: 'Livro não encontrado' });
    }

    // Enviando os dados do livro (incluindo a URL da capa)
    res.status(200).json(book);
  } catch (error) {
    console.error('Erro ao buscar o livro:', error);
    res.status(500).json({ error: 'Erro ao buscar o livro' });
  }
};

// Função para atualizar um livro
exports.updateBook = async (req, res) => {
  try {
    const book = await Book.updateOne({_id: req.params.id}, req.body);
    res.status(201).json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Erro ao atualizar o livro.'});
  }
};

// Função para deletar um livro
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.deleteOne({_id: req.params.id});
    res.status(201).json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Erro ao deletar o livro.'});
  }
};
