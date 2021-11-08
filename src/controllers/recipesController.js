// Importação do express-rescue
const rescue = require('express-rescue');
// Importação do Joi
const Joi = require('joi');
// Importação do path
const path = require('path');

// Importação do recipesService
const recipesService = require('../services/recipesService');

// HTTP status code 
const HTTP = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  CONFLICT: 409,
};

// Cria uma receita
const create = rescue(async (req, res, next) => {
  // Pega as informações passadas via corpo da requisição
  const { name, ingredients, preparation } = req.body;

  // Cria um objeto joi para validar as informações
  const { error } = Joi.object({
    name: Joi.string().required(),
    ingredients: Joi.string().required(),
    preparation: Joi.string().required(),
  }).validate(req.body);

  // Verifica se houve algum erro nas validações
  if (error) return res.status(HTTP.BAD_REQUEST).json({ message: 'Invalid entries. Try again.' });

  // Pega o id do usuário através da resposta do middleware
  const { userId } = res;

  // Cria uma nova receita com as informações que foram passadas
  const newRecipe = await recipesService.create(name, ingredients, preparation, userId);

  // Caso ocorra algum erro na criação retorna mensagem de erro
  if (newRecipe.err) return next(newRecipe.err);

  // Retorna o status code e a receita criada
  return res.status(HTTP.CREATED).json({
    recipe: {
      ...newRecipe,
      userId: res.id,
    },
  });
});

// Lista todas as receitas cadastradas
const getAll = rescue(async (_req, res, _next) => {
  // Realiza a busca de todas as receitas
  const allRecipes = await recipesService.getAll();

  // Retorna o status code e a lista de receitas
  return res.status(HTTP.OK).json(allRecipes);
});

// Busca uma receita pelo id
const getOne = rescue(async (req, res, _next) => {
  // Pega o id informado na url da requisição
  const { id } = req.params;

  // Caso o id informado seja inválido retorna mensagem de erro
  if (id.length < 24) return res.status(HTTP.NOT_FOUND).json({ message: 'recipe not found' });

  // Busca a receita com o id informado
  const response = await recipesService.getOne(id);

  // Caso não tenha resposta da busca retorna uma mensagem de erro
  if (!response) return res.status(HTTP.NOT_FOUND).json({ message: 'recipe not found' });

  // Retorna o status code e a receita
  return res.status(HTTP.OK).json(response);
});

// Edita uma receita
const updateOne = rescue(async (req, res, _next) => {
  // Pega o id informado na url da requisição
  const { id } = req.params;

  // Pega o id e o tipo de usuário da resposta do middleware
  const { role, userId } = res;

  // Pega as informações do corpo da requisição
  const { name, ingredients, preparation } = req.body;

  // Busca a receita pelo id
  const recipe = await recipesService.getOne(id);

  // Verifica se o usuário é o autor ou admin
  if (userId === recipe.userId || role === 'admin') {
    // Edita a receita pelo id
    await recipesService.updateOne(id, name, ingredients, preparation);

    // Retorna status code e a receita alterada
    return res.status(HTTP.OK).json({ _id: id, name, ingredients, preparation, userId });
  }

  // Caso o usuário não seja autor nem admin retorna mensagem de erro
  return res.status(HTTP.UNAUTHORIZED).json({ message: 'not authorized to edit this recipe' });
});

// Deleta uma receita
const deleteOne = rescue(async (req, res, _next) => {
  // Pega o id informado na url da requisição
  const { id } = req.params;

  // Pega o id e o tipo de usuário da resposta do middleware
  const { role, userId } = res;
  
  // Busca a receita com o id informado
  const recipe = await recipesService.getOne(id);

  // Verifica se o usuário é o autor ou admin
  if (userId === recipe.userId || role === 'admin') {
    // Deleta a receita com o id informado
    await recipesService.deleteOne(id);

    // Retorna// Deleta a receita com o id informado o status code
    return res.status(HTTP.NO_CONTENT).send();
  }

  // Caso o usuário não seja autor nem admin retorna mensagem de erro
  return res.status(HTTP.UNAUTHORIZED).json({ message: 'not authorized to delete this recipe' });
});

// Adiciona imagem na receita
const addImage = rescue(async (req, res, next) => {
  // Pega o id informado na url da requisição
  const { id } = req.params;

  // Pega o id e o tipo de usuário da resposta do middleware
  const { role, userId } = res;

  // Busca a receita com o id informado
  const recipe = await recipesService.getOne(id);

  // Caso não encontre a receita retorna mensagem de erro
  if (!recipe) return res.status(HTTP.BAD_REQUEST).json({ message: 'recipe not found' });

  // Verifica se o usuário é o autor ou admin
  if (userId === recipe.userId || role === 'admin') {
    await recipesService.addImage(id, `${id}.jpeg`);
    res.response = { ...recipe, image: `localhost:3000/src/uploads/${id}.jpeg` };

    return next();
  }

  // Retorna mensagem de erro caso o usuário não seja autor ou admin
  return res.status(HTTP.UNAUTHORIZED).json({ message: 'not authorized to add image this recipe' });
});

const getImage = rescue((req, res) => {
  const { id } = req.params;

  return res.sendFile(`${id}.jpeg`, { root: path.join(__dirname, '..', 'uploads') });
});

module.exports = {
  create,
  getAll,
  getOne,
  updateOne,
  deleteOne,
  addImage,
  getImage,
}; 