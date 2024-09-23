// config/db.js
const mongoose = require('mongoose');
require('dotenv').config(); // Carrega variáveis de ambiente

const connectDB = async () => {
  const uri = process.env.MONGODB_URL;
  try {
    // Conectando ao banco sem opções desnecessárias
    const conn = await mongoose.connect(uri);

    console.log(`MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Erro ao conectar ao MongoDB: ${error}`);
    process.exit(1); // Encerra o processo com falha
  }
};

module.exports = connectDB;
