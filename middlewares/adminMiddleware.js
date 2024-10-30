const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware para verificar se o usuário é administrador
const adminMiddleware = async (req, res, next) => {
	const authHeader = req.headers['authorization'];

	if (!authHeader) {
		return res.status(401).json({ error: 'Token não fornecido.' });
	}

	const token = authHeader.split(' ')[1];

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;

		const users = await User.find();

		// Verifica se o usuário é admin
		if (req.user.role !== 'admin') {
			return res.status(200).json(users.map((user) => ({ id: user.id, email: user.email }))); // Retorna apenas id e e-mail
			//return res.status(403).json({ error: 'Acesso negado. Permissões insuficientes.' });
		}
		next(); // Permite o acesso se o usuário for admin
	} catch (e) {
		return res.status(403).json({ error: 'Token inválido ou expirado.' });
	}
};

module.exports = adminMiddleware;
