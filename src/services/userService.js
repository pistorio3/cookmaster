// Importação do Model
const userModel = require('../model/userModel');

// Cria um novo usuário
const create = async (name, email, password, role) => {
  const response = await userModel.create(name, email, password, role);
  return response;
};

// Realiza o login
const login = async (email, password) => {
  const response = await userModel.login(email, password);
  return response;
};

// Busca um usuário pelo email cadastrado
const findByEmail = async (email) => {
  const response = await userModel.findByEmail(email);
  return response;
};

// Exportação padrão
module.exports = {
  create,
  login,
  findByEmail,
}; 