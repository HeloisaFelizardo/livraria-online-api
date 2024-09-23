// server.js
const express = require('express');
const connectDB = require('./config/db');  // Importa a conexão com o MongoDB
require('dotenv').config();

const app = express();

// Middleware para parsing de JSON
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Conecte ao MongoDB
connectDB();

// Importa as rotas de livros
const bookRoutes = require('./routes/bookRoutes');
app.use('/books', bookRoutes);

// Rota básica
app.get('/', (req, res) => {
  res.send('API de Livraria Online');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
