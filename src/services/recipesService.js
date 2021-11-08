// Importação do recipesModel
const recipesModel = require('../model/recipesModel');

// Cria uma receita
const create = async (name, ingredients, preparation, userId) => {
  const response = await recipesModel.create(name, ingredients, preparation, userId);

  return response;
};

// Lista todas as receitas cadastradas
const getAll = async () => {
  const response = await recipesModel.getAll();

  return response;
};

// Busca uma receita pelo id
const getOne = async (id) => {
  const response = await recipesModel.getOne(id);

  return response;
};

// Edita a receita pelo id
const updateOne = async (id, name, ingredients, preparation) => {
  const response = await recipesModel.updateOne(id, name, ingredients, preparation);

  return response;
};

// Deleta a receita com o id informado
const deleteOne = async (id) => {
  const response = await recipesModel.deleteOne(id);

  return response;
};

const addImage = async (id, image) => {
  const response = await recipesModel.addImage(id, image);

  return response;
};

module.exports = {
  create,
  getAll,
  getOne,
  updateOne,
  deleteOne,
  addImage,
}; 