const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Função para registrar um novo usuário
exports.registerUser = async (req, res) => {
  try {
    const {name, email, password} = req.body;

    // Verifica se o usuário já existe
    const userExists = await User.findOne({email});

    if (userExists) {
      return res.status(400).json({error: 'Email já registrado. Usuário já existe.'});
    }

    // Cria um novo usuário
    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    // Salva o novo usuário no banco de dados
    await newUser.save();
    console.log('Usuário salvo no MongoDB:', newUser);

    res.status(201).json({
      message: 'Usuário salvo com sucesso!',
      user: newUser,
    });

  } catch (e) {
    console.error('Erro ao criar usuário:', e);
    res.status(500).json({error: 'Erro ao criar usuário.'});
  }
}

// Função para fazer login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verifica se o usuário existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    // Verifica a senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    // Gera o token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    res.status(200).json({ message: 'Login efetuado com sucesso.', token });

  } catch (e) {
    console.error('Erro ao fazer login:', e);
    res.status(500).json({ error: 'Erro ao fazer login.' });
  }
};
