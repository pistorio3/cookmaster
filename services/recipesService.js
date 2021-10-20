const recipesModel = require('../model/recipesModel');

const create = async (name, ingredients, preparation, userId) => {
  const response = await recipesModel.create(name, ingredients, preparation, userId);

  return response;
};

const getAll = async () => {
  const response = await recipesModel.getAll();

  return response;
};

const getOne = async (id) => {
  const response = await recipesModel.getOne(id);

  return response;
};

const updateOne = async (id, name, ingredients, preparation) => {
  const response = await recipesModel.updateOne(id, name, ingredients, preparation);

  return response;
};

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