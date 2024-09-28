const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Função para registrar um novo usuário
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Verifica se o usuário já existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'Email já registrado.' });
    }

    // Cria um novo usuário com o papel (role)
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: req.body.role || 'user', // Define 'user' como padrão se o campo role não for enviado
    });

    // Salva o usuário no banco de dados
    await newUser.save();
    res.status(201).json({ message: 'Usuário registrado com sucesso!', user: newUser });
  } catch (e) {
    console.error('Erro ao registrar usuário:', e);
    res.status(500).json({ error: 'Erro ao registrar usuário.' });
  }
};


// Função para fazer login
exports.loginUser = async (req, res) => {
  try {
    const {email, password} = req.body;

    // Verifica se o usuário existe
    const user = await User.findOne({email});
    if (!user) {
      return res.status(401).json({error: 'Credenciais inválidas.'});
    }

    // Verifica a senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({error: 'Credenciais inválidas.'});
    }

    // Gera o token JWT com o role
    const token = jwt.sign(
      { id: user._id, role: user.role }, // Incluindo o campo role aqui
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({message: 'Login efetuado com sucesso.', token});

  } catch (e) {
    console.error('Erro ao fazer login:', e);
    res.status(500).json({error: 'Erro ao fazer login.'});
  }
};

// Função para obter informações do usuário
exports.getUserInfo = async (req, res) => {
  try {
    const userId = req.params.id;

    // Busca o usuário pelo ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    res.status(200).json({
      message: 'Usuário encontrado com sucesso!',
      user,
    });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ error: 'Erro ao buscar usuário.' });
  }
};

// Função para listar todos os usuários
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({message: 'Listagem de todos os usuários', users: users});
  } catch (e) {
    console.error('Erro ao buscar usuários:', e);
    res.status(500).json({error: 'Erro ao buscar usuários.'});
  }
};

// Função para atualizar um usuário
exports.updateUser = async (req, res) => {
  try {
    // Verifica se o usuário autenticado está tentando atualizar a própria conta
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ error: 'Você só pode atualizar sua própria conta.' });
    }

    const {email} = req.body;

    // Verifica se o usuário existe pelo ID
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({error: 'Usuário não encontrado.'});
    }

    // Verifica se o e-mail já está registrado por outro usuário
    const userExists = await User.findOne({email, _id: {$ne: req.params.id}});
    if (userExists) {
      return res.status(400).json({error: 'Email já registrado por outro usuário.'});
    }

    // Atualiza o usuário
    const result = await User.updateOne({_id: req.params.id}, req.body);

    if (result.matchedCount === 0) {
      return res.status(404).json({error: 'Usuário não encontrado.'});
    }

    if (result.nModified === 0) {
      return res.status(200).json({message: 'Nenhuma modificação feita, dados já estão atualizados.'});
    }

    res.status(200).json({message: 'Usuário atualizado com sucesso.'});
  } catch (e) {
    console.error('Erro ao atualizar usuário:', e);
    res.status(500).json({error: 'Erro ao atualizar usuário.'});
  }
};

// Função para deletar um usuário
exports.deleteUser = async (req, res) => {
  try {
    // Se o usuário não for admin, verifica se está tentando excluir sua própria conta
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      return res.status(403).json({ error: 'Acesso negado. Permissões insuficientes para excluir este usuário.' });
    }
    const result = await User.deleteOne({ _id: req.params.id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    res.status(200).json({ message: 'Usuário deletado com sucesso.' });
  } catch (e) {
    console.error('Erro ao deletar usuário:', e);
    res.status(500).json({ error: 'Erro ao deletar usuário.' });
  }
};


