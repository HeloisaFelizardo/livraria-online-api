const express = require('express');
const connectDB = require('./config/db'); // Importa a conexão com o MongoDB
require('dotenv').config();
const cors = require('cors');

const app = express();

// Middleware para parsing de JSON
app.use(express.json());

// Habilita o CORS com uma lista de origens
app.use(
	cors({
		origin: [
			'http://localhost:3001',
			'http://localhost:3002',
			'http://localhost:5173',
			'http://localhost:5174',
			'http://localhost:5175',
			'https://ebooks-cn24.onrender.com/',
		],
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization'],
		credentials: true, // Habilita envio de cookies
	}),
);

// Conecte ao MongoDB
connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Servidor rodando na porta ${PORT}`);
});

// Rota básica
app.get('/', (req, res) => {
	res.send('API de Livraria Online');
});

// Importa as rotas de usuários
const userRoutes = require('./routes/userRoutes');
app.use('/users', userRoutes);

// Importa as rotas de livros
const bookRoutes = require('./routes/bookRoutes');
app.use('/books', bookRoutes);
