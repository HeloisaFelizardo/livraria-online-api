// server.js
const express = require('express');
const connectDB = require('./config/db'); // Importa a conexão com o MongoDB
require('dotenv').config();
const cors = require('cors');

const app = express();

// Habilita o cors e seta uma lista de 'origens'
app.use(
	cors({
		// Adicionando 'http://' antes dos endereços
		origin: [
			'http://localhost:3001',
			'http://localhost:3002',
			'http://localhost:5173',
			'http://localhost:5174',
		],
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // Adicionando OPTIONS
		allowedHeaders: ['Content-Type', 'Authorization'],
		credentials: true, // Habilita o envio de cookies e credenciais
	}),
);

// Middleware para parsing de JSON
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Conecte ao MongoDB
connectDB();

// Importa as rotas de livros
const bookRoutes = require('./routes/bookRoutes');
app.use('/books', bookRoutes);

// Importa as rotas de usuários
const userRoutes = require('./routes/userRoutes');
app.use('/users', userRoutes);

// Rota básica
app.get('/', (req, res) => {
	res.send('API de Livraria Online');
});

app.listen(PORT, () => {
	console.log(`Servidor rodando na porta ${PORT}`);
});
