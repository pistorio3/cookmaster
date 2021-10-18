const userModel = require('../model/userModel');

const create = async (name, email, password, role) => {
  const response = await userModel.create(name, email, password, role);
  return response;
};

const findByEmail = async (email) => {
  const response = await userModel.findByEmail(email);
  return response;
};

module.exports = {
  create,
  findByEmail,
}; 