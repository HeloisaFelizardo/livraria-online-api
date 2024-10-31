const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
	const authHeader = req.headers['authorization'];

	if (!authHeader) {
		return res.status(401).json({ error: 'Token não fornecido.' });
	}

	const token = authHeader.split(' ')[1]; // Remove 'Bearer '

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifica se o token é válido
		req.user = decoded; // Adiciona os dados do usuário no request
		next(); // Prossegue para a rota protegida
	} catch (e) {
		return res.status(403).json({ error: 'Token inválido ou expirado.' });
	}
};

module.exports = authMiddleware;
