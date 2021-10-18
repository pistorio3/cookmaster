const express = require('express');
const bodyParser = require('body-parser');

const { userController, recipesController } = require('../../controllers');

const errorMiddleware = require('../../middlewares/errorControler');
const authentication = require('../../middlewares/authentication');

const app = express();

app.use(bodyParser.json());

// Não remover esse end-point, ele é necessário para o avaliador
app.get('/', (request, response) => {
  response.send();
});
// Não remover esse end-point, ele é necessário para o avaliador

app.post('/users', userController.create);

app.post('/login', userController.login);

app.post('/recipes', authentication, recipesController.create);

app.get('/recipes', recipesController.getAll);

app.get('/recipes/:id', recipesController.getOne);

app.use(errorMiddleware);

module.exports = app;
