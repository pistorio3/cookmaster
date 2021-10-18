const express = require('express');
const bodyParser = require('body-parser');

const errorMiddleware = require('../../middlewares/errorControler');
const { userController } = require('../../controllers');

const app = express();

app.use(bodyParser.json());

// Não remover esse end-point, ele é necessário para o avaliador
app.get('/', (request, response) => {
  response.send();
});
// Não remover esse end-point, ele é necessário para o avaliador

app.get('/ping', (_req, res) => {
  res.send('pong');
});

app.post('/users', userController.create);

app.post('/login', userController.login);

app.use(errorMiddleware);

module.exports = app;
