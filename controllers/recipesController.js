const rescue = require('express-rescue');
const Joi = require('joi');
const RecipesService = require('../services/recipesService');

const create = rescue(async (req, res, next) => {
  const { name, ingredients, preparation } = req.body;

  const { error } = Joi.object({
    name: Joi.string().required(),
    ingredients: Joi.string().required(),
    preparation: Joi.string().required(),
  }).validate(req.body);

  if (error) return res.status(400).json({ message: 'Invalid entries. Try again.' });

  const newRecipe = await RecipesService.create(name, ingredients, preparation);
  if (newRecipe.err) return next(newRecipe.err);

  return res.status(201).json({
    recipe: {
      ...newRecipe,
      userId: res.id,
    },
  });
});

const getAll = rescue(async (rec, res, _next) => {
  const allRecipes = await RecipesService.getAll();
  return res.status(200).json(allRecipes);
});

module.exports = {
  create,
  getAll,
}; 