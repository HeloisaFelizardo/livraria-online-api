const mongoose = require('mongoose');

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URL);
		console.log('Conectado ao MongoDB:', mongoose.connection.name);
	} catch (error) {
		console.error('Erro ao conectar ao MongoDB:', error.message);
		process.exit(1); // Encerra o processo em caso de falha
	}
};

module.exports = connectDB;
