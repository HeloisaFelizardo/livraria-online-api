const jwt = require('jsonwebtoken');

// Middleware para verificar se o usuário é administrador
const adminMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Verifica se o usuário é admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado. Permissões insuficientes.' });
    }
    next(); // Permite o acesso se o usuário for admin
  } catch (e) {
    return res.status(403).json({ error: 'Token inválido ou expirado.' });
  }
};

module.exports = adminMiddleware;
