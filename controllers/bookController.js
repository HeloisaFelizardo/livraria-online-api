const Book = require('../models/Book');
const path = require('path');
const fs = require('fs');

// Função para fazer upload de um livro e extrair a capa
exports.uploadBook = async (req, res) => {
	console.log('Requisição recebida para upload');

	const { title, author, description } = req.body;

	try {
		// Verifica se o título do livro já existe
		if (await Book.findOne({ title })) {
			return res.status(400).json({ error: 'Livro já cadastrado.' });
		}

		// Verifica se ambos os arquivos foram enviados
		if (!req.files?.['pdf'] || !req.files?.['cover']) {
			return res.status(400).json({ error: 'Arquivos PDF e capa são obrigatórios.' });
		}

		// Lê o conteúdo dos arquivos PDF e imagem da capa
		const pdfBuffer = fs.readFileSync(path.resolve(req.files['pdf'][0].path));
		const coverBuffer = fs.readFileSync(path.resolve(req.files['cover'][0].path));

		// Cria e salva o novo livro no MongoDB
		const newBook = await new Book({
			title,
			author,
			description: description,
			pdfUrl: pdfBuffer,
			coverUrl: coverBuffer,
		}).save();

		console.log('Livro salvo no MongoDB:', newBook);

		// Limpeza de arquivos temporários
		fs.unlinkSync(req.files['pdf'][0].path);
		fs.unlinkSync(req.files['cover'][0].path);

		res.status(201).json({
			message: 'Livro salvo com sucesso!',
			book: {
				id: newBook._id,
				title: newBook.title,
				author: newBook.author,
				description: newBook.description,
				coverUrl: `data:image/jpeg;base64,${coverBuffer.toString('base64')}`,
			},
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

		// Mapeia os livros para converter o coverUrl de cada um para Base64
		const booksWithBase64Cover = books.map((book) => ({
			_id: book._id,
			title: book.title,
			author: book.author,
			description: book.description,
			pdfUrl: book.pdfUrl, // ou apenas o ID do PDF se estiver armazenado em um sistema de arquivos ou serviço de armazenamento
			coverUrl: book.coverUrl ? `data:image/jpeg;base64,${book.coverUrl.toString('base64')}` : null,
		}));

		res.status(200).json(booksWithBase64Cover);
	} catch (error) {
		console.error('Erro ao buscar os livros:', error);
		res.status(500).json({ error: 'Erro ao buscar os livros.' });
	}
};

// Função para buscar um livro por ID
exports.getBookById = async (req, res) => {
	try {
		// Buscando o livro pelo ID
		const book = await Book.findById(req.params.id);

		// Verificando se o livro existe
		if (!book || !book.pdfUrl || !book.coverUrl) {
			return res.status(404).json({ error: 'Livro não encontrado' });
		}

		// Para retornar a capa como JSON
		res.status(200).json({
			message: 'Livro encontrado',
			book: {
				title: book.title,
				author: book.author,
				description: book.description,
				coverUrl: book.coverUrl, // Retorna a URL da capa
				pdfUrl: book.pdfUrl,
			},
		});
	} catch (error) {
		console.error('Erro ao buscar o livro:', error);
		res.status(500).json({ error: 'Erro ao buscar o livro' });
	}
};

// Função para baixar o PDF do livro
exports.downloadBookPdf = async (req, res) => {
	try {
		const book = await Book.findById(req.params.id);

		if (!book || !book.pdfUrl) {
			return res.status(404).json({ error: 'Livro não encontrado' });
		}

		// Verifica se o conteúdo é um buffer ou uma string
		if (Buffer.isBuffer(book.pdfUrl)) {
			res.set('Content-Disposition', `attachment; filename="${book.title}.pdf"`);
			res.set('Content-Type', 'application/pdf');
			res.send(book.pdfUrl); // Retorna o PDF
		} else {
			// Se for uma URL, você pode redirecionar ou usar um método diferente para enviar o PDF
			res.redirect(book.pdfUrl); // Redireciona para a URL do PDF
		}
	} catch (error) {
		console.error('Erro ao baixar o livro:', error);
		res.status(500).json({ error: 'Erro ao baixar o livro' });
	}
};

// Função para atualizar um livro
exports.updateBook = async (req, res) => {
	console.log('Requisição recebida para atualização');

	const { title, author, description } = req.body;
	const updateData = { title, author, description };

	try {
		// Processamento do arquivo PDF, se enviado
		if (req.files?.['pdf']) {
			const pdfBuffer = fs.readFileSync(req.files['pdf'][0].path);
			updateData.pdfUrl = pdfBuffer;
			fs.unlinkSync(req.files['pdf'][0].path); // Exclui o arquivo temporário
		}

		// Processamento do arquivo de capa, se enviado
		if (req.files?.['cover']) {
			const coverBuffer = fs.readFileSync(req.files['cover'][0].path);
			updateData.coverUrl = coverBuffer;
			fs.unlinkSync(req.files['cover'][0].path); // Exclui o arquivo temporário
		}

		// Verifica se o titulo do livro já existe
		const bookWithSameTitle = await Book.findOne({ title, _id: { $ne: req.params.id } });
		if (bookWithSameTitle) {
			return res.status(400).json({ error: 'Livro já cadastrado.' });
		}

		const book = await Book.findByIdAndUpdate(req.params.id, updateData, { new: true });

		if (!book) {
			return res.status(404).json({ error: 'Livro não encontrado.' });
		}

		res.status(200).json(book);
	} catch (error) {
		console.error('Erro ao atualizar o livro:', error);
		res.status(500).json({ error: 'Erro ao atualizar o livro.' });
	}
};

// Função para deletar um livro
exports.deleteBook = async (req, res) => {
	try {
		const result = await Book.deleteOne({ _id: req.params.id });

		if (result.deletedCount === 0) {
			return res.status(404).json({ error: 'Livro não encontrado.' });
		}

		res.status(200).json({ message: 'Livro excluído com sucesso' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Erro ao deletar o livro.' });
	}
};
