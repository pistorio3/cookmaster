const RecipesModel = require('../model/recipesModel');

const create = async (name, ingredients, preparation) => {
  const response = await RecipesModel.create(name, ingredients, preparation);
  return response;
};

module.exports = {
  create,
}; 