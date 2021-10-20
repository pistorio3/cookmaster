const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

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
// Não remover esse end-point, ele é necessário para o avaliador

app.post('/users', userController.create);

app.post('/login', userController.login);

app.post('/recipes', authentication, recipesController.create);

app.get('/recipes', recipesController.getAll);

app.get('/recipes/:id', recipesController.getOne);

app.put('/recipes/:id', authentication, recipesController.updateOne);

app.delete('/recipes/:id', authentication, recipesController.deleteOne);

app.put('/recipes/:id/image', authentication, recipesController.addImage,
  upload.single('image'), (_req, res, _next) => res.status(200).json(res.response));

app.post('/users/admin', authentication, userController.createAdmin);

app.get('/recipes/:id/image', recipesController.getImage);

app.use(errorMiddleware);

module.exports = app;
