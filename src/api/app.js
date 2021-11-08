const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

// Importação dos controllers
const { userController, recipesController } = require('../controllers');

const errorMiddleware = require('../middlewares/errorControler');
const authentication = require('../middlewares/authentication');

const app = express();

app.use('/images', express.static(path.join(__dirname, '..', 'uploads')));

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, callback) => {
    callback(null, `${req.params.id}.jpeg`);
  },
});

const upload = multer({ storage });

app.use(bodyParser.json());

// Não remover esse end-point, ele é necessário para o avaliador
app.get('/', (request, response) => {
  response.send();
});

// Requisito 1 - Cadastro de usuários
app.post('/users', userController.create);

// Requisito 2 - Login de usuários
app.post('/login', userController.login);

// Requisito 3 - Cadastro de receitas
app.post('/recipes', authentication, recipesController.create);

// Requisito 4 - Listagem de receitas
app.get('/recipes', recipesController.getAll);

// Requisito 5 - Buscar receita pelo id
app.get('/recipes/:id', recipesController.getOne);

// Requisito 7 - Edição de uma receita
app.put('/recipes/:id', authentication, recipesController.updateOne);

// Requisito 8 - Exclui uma receita
app.delete('/recipes/:id', authentication, recipesController.deleteOne);

// Requisito 9 - Adiciona imagem na receita
app.put('/recipes/:id/image', authentication, recipesController.addImage,
  upload.single('image'), (_req, res, _next) => res.status(200).json(res.response));

// Requisito 10 - Acessar a imagem de uma receita
app.get('/recipes/:id/image', recipesController.getImage);

// Requisito 12 - Criar usuário admin
app.post('/users/admin', authentication, userController.createAdmin);

app.use(errorMiddleware);

module.exports = app;
