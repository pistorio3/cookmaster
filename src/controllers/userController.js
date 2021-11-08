// Importação do express-rescue
const rescue = require('express-rescue');
// Importação do Joi
const Joi = require('joi');
// Importação do jwt
const jwt = require('jsonwebtoken');

// Importação do userService
const userService = require('../services/userService');

// Secret para gerar um token
const secret = 'MySecretPassword';

// config do jwt
const jwtConfig = {
  expiresIn: '1d',
  algorithm: 'HS256',
};

// HTTP status code 
const HTTP = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  CONFLICT: 409,
};

// Cria um usuário
const create = rescue(async (req, res, next) => {
  // Pega as informações passadas via corpo da requisição
  const { name, email, password, role = 'user' } = req.body;
  
  // Cria um objeto joi para validar as informações
  const { error } = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required().regex(/\S*@\S*\.\S/),
    password: Joi.string().required(),
    role: Joi.string(),
  }).validate(req.body);

  // Verifica se houve algum erro nas validações
  if (error) return res.status(HTTP.BAD_REQUEST).json({ message: 'Invalid entries. Try again.' });

  // Verifica se o email ja esta cadastrado
  const verify = await userService.findByEmail(email);

  // Caso o email ja tenha sido cadastrado retorna mensagem de erro
  if (verify) { return res.status(HTTP.CONFLICT).json({ message: 'Email already registered' }); }

  // Cria um novo usuário com as informações que foram passadas
  const newUser = await userService.create(name, email, password, role);
  
  // Caso ocorra algum erro na criação retorna mensagem de erro
  if (newUser.err) return next(newUser.err);

  // Retorna o status code e o usuário criado
  return res.status(HTTP.CREATED).json(newUser);
});

// Login de usuário 
const login = rescue(async (req, res, _next) => {
  // Pega as informações passadas via corpo da requisição
  const { email, password } = req.body;

  // Cria um objeto joi para validar as informações
  const { error } = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }).validate(req.body);

  // Verifica se houve algum erro nas validações
  if (error) return res.status(HTTP.UNAUTHORIZED).json({ message: 'All fields must be filled' });
  
  // Realiza a busca do usuário com as informações passadas
  const user = await userService.login(email, password);

  // Verifica se houve sucesso na busca e retorna mensagem de erro caso não encontre
  if (!user) {
    return res.status(HTTP.UNAUTHORIZED).json({ message: 'Incorrect username or password' }); 
  }
  
  // Pega informações do usuário e cria o token
  const { _id, role } = user;
  const token = jwt.sign({ id: _id, email, role }, secret, jwtConfig);

  // Retorna o status code e o token gerado
  return res.status(HTTP.OK).json({ token });
});

const createAdmin = rescue(async (req, res, next) => {
  const { role } = res;
  const { name, email, password } = req.body;

  if (role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can register new admins' });
  }

  const newAdmin = await userService.create(name, email, password, role);

  if (newAdmin.err) return next(newAdmin.err);

  return res.status(201).json(newAdmin);
});

module.exports = {
  create,
  login,
  createAdmin,
}; 