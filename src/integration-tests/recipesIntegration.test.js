const chai = require('chai');
const chaiHttp = require('chai-http');
const MongoClient = require('mongodb/lib/mongo_client');
const sinon = require('sinon');
const { getConnection } = require('./connectionMock');
const server = require('../api/app');

chai.use(chaiHttp);
const { expect } = chai;

describe('POST /recipes', () => {
  let connection;

  before( async () => {
    connection = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connection);
  });

  after(() => MongoClient.connect.restore());

  // usuário não logado
  describe('quando o usuário não está logado', () => {
    let response;

    before(async () => {
        response = await chai.request(server).post('/recipes').send({
          name: 'Recipe Name',
          ingredients: 'Recipe ingredients',
          preparation: 'Recipe preparation',
        })
    });

    it('retorna o código 401', () => {
      expect(response).to.have.status(401);
    });

    it(' retorna um objeto', () => {
      expect(response.body).to.be.an('object');
    });

    it('o objeto contém a propriedade "message" com: "missing auth token"', () => {
      expect(response.body.message).to.be.equal('missing auth token');
    })
  });

  // sem o campo "name"
  describe('quando não é enviado o campo "name', () => {
    let response;

    before(async () => {
      await chai.request(server).post('/users').send({
        name: 'John',
        email: 'john@testingmail.com',
        password: 'myPassword',
      });

      const login = await chai.request(server).post('/login').send({
        email: 'john@testingmail.com',
        password: 'myPassword',
      });

      response = await chai.request(server).post('/recipes').set(
        'Authorization', login.body.token
      ).send({
        // name: 'Recipe Name',
        ingredients: 'Recipe ingredients',
        preparation: 'Recipe preparation',
      })
    });

    it('retorna o código 400', () => {
      expect(response).to.have.status(400);
    });

    it(' retorna um objeto', () => {
      expect(response.body).to.be.an('object');
    });

    it('o objeto contém a propriedade "message" com: "Invalid entries. Try again."', () => {
      expect(response.body.message).to.be.equal('Invalid entries. Try again.');
    });
  });
  // sem o campo "ingredients"
  describe('quando não é enviado o campo "ingredients', () => {
    let response;

    before(async () => {
      await chai.request(server).post('/users').send({
        name: 'John',
        email: 'john@testingmail.com',
        password: 'myPassword',
      });

      const login = await chai.request(server).post('/login').send({
        email: 'john@testingmail.com',
        password: 'myPassword',
      });

      response = await chai.request(server).post('/recipes').set(
        'Authorization', login.body.token
      ).send({
        name: 'Recipe Name',
        // ingredients: 'Recipe ingredients',
        preparation: 'Recipe preparation',
      })
    });

    it('retorna o código 400', () => {
      expect(response).to.have.status(400);
    });

    it(' retorna um objeto', () => {
      expect(response.body).to.be.an('object');
    });

    it('o objeto contém a propriedade "message" com: "Invalid entries. Try again."', () => {
      expect(response.body.message).to.be.equal('Invalid entries. Try again.');
    });
  });

  // sem o campo "preparation"
  describe('quando não é enviado o campo "preparation"', () => {
    let response;

    before(async () => {
      await chai.request(server).post('/users').send({
        name: 'John',
        email: 'john@testingmail.com',
        password: 'myPassword',
      });

      const login = await chai.request(server).post('/login').send({
        email: 'john@testingmail.com',
        password: 'myPassword',
      });

      response = await chai.request(server).post('/recipes').set(
        'Authorization', login.body.token
      ).send({
        name: 'Recipe Name',
        ingredients: 'Recipe ingredients',
        // preparation: 'Recipe preparation',
      })
    });

    it('retorna o código 400', () => {
      expect(response).to.have.status(400);
    });

    it(' retorna um objeto', () => {
      expect(response.body).to.be.an('object');
    });

    it('o objeto contém a propriedade "message" com: "Invalid entries. Try again."', () => {
      expect(response.body.message).to.be.equal('Invalid entries. Try again.');
    });
  });

  // com um token inválido
  describe('quando o token é inválido', () => {
    let response;

    before(async () => {
      response = await chai.request(server).post('/recipes').set(
        'Authorization', '4213689fas5r4123da37981'
      ).send({
        name: 'Recipe Name',
        ingredients: 'Recipe ingredients',
        preparation: 'Recipe preparation',
      })
    });

    it('retorna o código 401', () => {
      expect(response).to.have.status(401);
    });

    it(' retorna um objeto', () => {
      expect(response.body).to.be.an('object');
    });

    it('o objeto contém a propriedade "message" com: "jwt malformed"', () => {
      expect(response.body.message).to.be.equal('jwt malformed');
    });
  });

  //logado, com token válido e um payload válido
  describe('quando o token e o payload são válidos', () => {
    let response;

    before(async () => {
      await chai.request(server).post('/users').send({
        name: 'John',
        email: 'john@testingmail.com',
        password: 'myPassword',
      });

      const login = await chai.request(server).post('/login').send({
        email: 'john@testingmail.com',
        password: 'myPassword',
      });

      response = await chai.request(server).post('/recipes').set(
        'Authorization', login.body.token
      ).send({
        name: 'Recipe Name',
        ingredients: 'Recipe ingredients',
        preparation: 'Recipe preparation',
      })
    });

    it('retorna o código 201', () => {
      expect(response).to.have.status(201);
    });

    it(' retorna um objeto', () => {
      expect(response.body).to.be.an('object');
    });

    it('o objeto contém a propriedade "recipe"', () => {
      expect(response.body).to.have.property('recipe');
    });

    it('a propriedade recipe contém um objeto com as propriedades: "name", "ingredients", "preparation", "userId" e "_id"', () => {
      expect(response.body.recipe).to.have.keys("name", "ingredients", "preparation", "userId", "_id");
    })
  });
}); 

describe('GET /recipes', () => {
  let connection;

  before( async () => {
    connection = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connection);
  });

  after(() => MongoClient.connect.restore());

  describe('lista todas as receitas', () => {
    let response;

    before(async () => {
      await chai.request(server).post('/users').send({
        name: 'John',
        email: 'john@testingmail.com',
        password: 'myPassword',
      });

      const login = await chai.request(server).post('/login').send({
        email: 'john@testingmail.com',
        password: 'myPassword',
      });

      await chai.request(server).post('/recipes').set(
        'Authorization', login.body.token
      ).send({
        name: 'Recipe Name',
        ingredients: 'Recipe ingredients',
        preparation: 'Recipe preparation',
      });

      response = await chai.request(server).get('/recipes');
    });

    it('retorna o status 200', () => {
      expect(response).to.have.status(200);
    });

    it('retorna um array no body', () => {
      expect(response.body).to.be.an('array');
    });

    it('o array não está vazio', () => {
      expect(response.body[0]).to.not.be.empty;
    });
  });
});

describe('GET /recipes/:id', () => {
  let connection;

  before( async () => {
    connection = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connection);
  });

  after(() => MongoClient.connect.restore());

  describe('lista uma receita, buscando pelo ID', () => {
    let response;

    before(async () => {
      await chai.request(server).post('/users').send({
        name: 'John',
        email: 'john@testingmail.com',
        password: 'myPassword',
      });

      const login = await chai.request(server).post('/login').send({
        email: 'john@testingmail.com',
        password: 'myPassword',
      });

      const recipe = await chai.request(server).post('/recipes').set(
        'Authorization', login.body.token
      ).send({
        name: 'Recipe Name',
        ingredients: 'Recipe ingredients',
        preparation: 'Recipe preparation',
      });

      const { _id } = recipe.body.recipe;
      response = await chai.request(server).get(`/recipes/${_id}`);
    });

    it('retorna o status 200 ok', () => {
      expect(response).to.have.status(200);
    });

    it('retorna um objeto', () => {
      expect(response.body).to.be.an('object');
    });
  });
});

describe('PUT /recipes/:id', () => {
  let connection;

  before( async () => {
    connection = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connection);
  });

  after(() => MongoClient.connect.restore());

  // usuário não logado
  describe('quando o usuário não está logado', () => {
    let response;

    before(async () => {
      await chai.request(server).post('/users').send({
        name: 'John',
        email: 'john@testingmail.com',
        password: 'myPassword',
      });

      const login = await chai.request(server).post('/login').send({
        email: 'john@testingmail.com',
        password: 'myPassword',
      });

      const recipe = await chai.request(server).post('/recipes').set(
        'Authorization', login.body.token
      ).send({
        name: 'Recipe Name',
        ingredients: 'Recipe ingredients',
        preparation: 'Recipe preparation',
      });

      const { _id } = recipe.body.recipe;
      response = await chai.request(server).put(`/recipes/${_id}`).send({
        name: 'New Name',
        ingredients: 'New ingredients',
        preparation: 'New preparation',
      });
    });

    it('retorna o status 401', () => {
      expect(response).to.have.status(401);
    });

    it('retorna um objeto', () => {
      expect(response.body).to.be.an('object');
    });

    it('o objeto tem a propriedade message: "missing auth token"', () => {
      expect(response.body.message).to.be.equal('missing auth token');
    });
  });

  // token inválido
  describe('quando o usuário não está logado', () => {
    let response;

    before(async () => {
      await chai.request(server).post('/users').send({
        name: 'John',
        email: 'john@testingmail.com',
        password: 'myPassword',
      });

      const login = await chai.request(server).post('/login').send({
        email: 'john@testingmail.com',
        password: 'myPassword',
      });

      const recipe = await chai.request(server).post('/recipes').set(
        'Authorization', login.body.token
      ).send({
        name: 'Recipe Name',
        ingredients: 'Recipe ingredients',
        preparation: 'Recipe preparation',
      });

      const { _id } = recipe.body.recipe;
      response = await chai.request(server).put(`/recipes/${_id}`).set(
        'Authorization', 'xablau'
      ).send({
        name: 'New Name',
        ingredients: 'New ingredients',
        preparation: 'New preparation',
      });
    });

    it('retorna o status 401', () => {
      expect(response).to.have.status(401);
    });

    it('retorna um objeto', () => {
      expect(response.body).to.be.an('object');
    });

    it('o objeto tem a propriedade message: "jwt malformed"', () => {
      expect(response.body.message).to.be.equal('jwt malformed');
    });
  });

  // receita é do próprio usuário

  // usuário é o admin
});

describe('DELETE /recipes/:id', () => {
  let connection;

  before( async () => {
    connection = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connection);
  });

  after(() => MongoClient.connect.restore());

  // não autenticado
  describe('quando o usuário não está autenticado', () => {
    let response;

    before(async () => {
      await chai.request(server).post('/users').send({
        name: 'John',
        email: 'john@testingmail.com',
        password: 'myPassword',
      });

      const login = await chai.request(server).post('/login').send({
        email: 'john@testingmail.com',
        password: 'myPassword',
      });

      const recipe = await chai.request(server).post('/recipes').set(
        'Authorization', login.body.token
      ).send({
        name: 'Recipe Name',
        ingredients: 'Recipe ingredients',
        preparation: 'Recipe preparation',
      });

      const { _id } = recipe.body.recipe;
      response = await chai.request(server).delete(`/recipes/${_id}`);
    });

    it('retorna o código 401', () => {
      expect(response).to.have.status(401);
    });

    it('retorna a mensagem "missing auth token"', () => {
      expect(response.body.message).to.be.equal('missing auth token');
    });
  });

  // autenticado
  describe('quando o usuário está autenticado', () => {
    let response;

    before(async () => {
      await chai.request(server).post('/users').send({
        name: 'John',
        email: 'john@testingmail.com',
        password: 'myPassword',
      });

      const login = await chai.request(server).post('/login').send({
        email: 'john@testingmail.com',
        password: 'myPassword',
      });

      const recipe = await chai.request(server).post('/recipes').set(
        'Authorization', login.body.token
      ).send({
        name: 'Recipe Name',
        ingredients: 'Recipe ingredients',
        preparation: 'Recipe preparation',
      });

      const { _id } = recipe.body.recipe;
      response = await chai.request(server).delete(`/recipes/${_id}`).set(
        'Authorization', login.body.token
      );
    });

    it('retorna o código 204', () => {
      expect(response).to.have.status(204);
    });

    it('não retorna um body', () => {
      expect(response.body).to.be.empty;
    });
  });
});

describe('PUT /recipes/:id/image', () => {
  let connection;

  before( async () => {
    connection = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connection);
  });

  after(() => MongoClient.connect.restore());

  // Será validado que não é possível enviar foto sem estar autenticado
  describe('Verifica se não é possível enviar uma foto sem estar autenticado', () => {
    let response;

    before(async () => {
      await chai.request(server).post('/users').send({
        name: 'John',
        email: 'john@testingmail.com',
        password: 'myPassword',
      });

      const login = await chai.request(server).post('/login').send({
        email: 'john@testingmail.com',
        password: 'myPassword',
      });

      const recipe = await chai.request(server).post('/recipes').set(
        'Authorization', login.body.token
      ).send({
        name: 'Recipe Name',
        ingredients: 'Recipe ingredients',
        preparation: 'Recipe preparation',
      });

      const { _id } = recipe.body.recipe;
      response = await chai.request(server).put(`/recipes/${_id}/image`).attach(
        'image', 'src/uploads/ratinho.jpg'
      );

    });

    it('retorna status 401', () => {
      expect(response).to.have.status(401);
    });

    it('retorna a mensagem: "not authorized to add image this recipe"', () => {
      expect(response.body.message).to.be.equal('missing auth token');
    });

  });

  // É possível enviar uma foto com o usuário autenticado
  describe('é possível enviar uma foto com o usuário autenticado', () => {
    let response;
    let id;

    before(async () => {
      await chai.request(server).post('/users').send({
        name: 'John',
        email: 'john@testingmail.com',
        password: 'myPassword',
      });

      const login = await chai.request(server).post('/login').send({
        email: 'john@testingmail.com',
        password: 'myPassword',
      });

      const recipe = await chai.request(server).post('/recipes').set(
        'Authorization', login.body.token
      ).send({
        name: 'Recipe Name',
        ingredients: 'Recipe ingredients',
        preparation: 'Recipe preparation',
      });

      const { _id } = recipe.body.recipe;
      id = _id;
      response = await chai.request(server).put(`/recipes/${_id}/image`).set(
        'Authorization', login.body.token
      ).attach(
        'image', 'src/uploads/ratinho.jpg'
      );
    });

    it('retorna o status 200', () => {
      expect(response).to.have.status(200);
    });

    it('retorna um objeto', () => {
      expect(response.body).to.be.an('object');
    });

    it('o objeto retornado tem as propriedades: _id, name, ingredients, preparation, userId, image', () => {
      expect(response.body).to.have.keys('_id', 'name', 'ingredients', 'preparation', 'userId', 'image');
    });

    it('o caminho da imagem salvo no banco está correto', () => {
      expect(response.body.image).to.be.equal(`localhost:3000/src/uploads/${id}.jpeg`);
    });
  });

  // Será validado que é possível enviar foto com usuário admin
  describe('é possível enviar uma foto se for "admin"', () => {
    let response;
    let id;

    before(async () => {
      await chai.request(server).post('/users').send({
        name: 'John',
        email: 'john@testingmail.com',
        password: 'myPassword',
      });

      await chai.request(server).post('/users').send({
        name: 'Admin',
        email: 'admin@admin.com',
        password: 'adminPassword',
        role: 'admin',
      });

      const userLogin = await chai.request(server).post('/login').send({
        email: 'john@testingmail.com',
        password: 'myPassword',
      });

      const adminLogin = await chai.request(server).post('/login').send({
        email: 'admin@admin.com',
        password: 'adminPassword',
      });

      const recipe = await chai.request(server).post('/recipes').set(
        'Authorization', userLogin.body.token
      ).send({
        name: 'Recipe Name',
        ingredients: 'Recipe ingredients',
        preparation: 'Recipe preparation',
      });

      const { _id } = recipe.body.recipe;
      id = _id;
      response = await chai.request(server).put(`/recipes/${_id}/image`).set(
        'Authorization', adminLogin.body.token
      ).attach(
        'image', 'src/uploads/ratinho.jpg'
      );
    });

    it('verifica se o status da resposta é 200', () => {
      expect(response).to.have.status(200);
    });
  })
});

describe('GET /recipes/:id/image', () => {
  // Será validado que é retornada uma imagem como resposta
  let response;
    let id;

    before(async () => {
      await chai.request(server).post('/users').send({
        name: 'John',
        email: 'john@testingmail.com',
        password: 'myPassword',
      });

      await chai.request(server).post('/users').send({
        name: 'Admin',
        email: 'admin@admin.com',
        password: 'adminPassword',
        role: 'admin',
      });

      const userLogin = await chai.request(server).post('/login').send({
        email: 'john@testingmail.com',
        password: 'myPassword',
      });

      const adminLogin = await chai.request(server).post('/login').send({
        email: 'admin@admin.com',
        password: 'adminPassword',
      });

      const recipe = await chai.request(server).post('/recipes').set(
        'Authorization', userLogin.body.token
      ).send({
        name: 'Recipe Name',
        ingredients: 'Recipe ingredients',
        preparation: 'Recipe preparation',
      });

      const { _id } = recipe.body.recipe;
      id = _id;
      await chai.request(server).put(`/recipes/${_id}/image`).set(
        'Authorization', adminLogin.body.token
      ).attach(
        'image', 'src/uploads/ratinho.jpg'
      );

      response = await chai.request(server).get(`/recipes/${_id}/image`);
    });

    it('verifica se o status da resposta é 200', () => {
      expect(response).to.have.status(200);
    });
}); 