const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');
const MongoClient = require('mongodb/lib/mongo_client');
const { getConnection } = require('./connectionMock');
const server = require('../api/app');

chai.use(chaiHttp);
const { expect } = chai;

describe('POST /users', () => {
  let connection;

  before( async () => {
    connection = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connection);
  });

  after(() => MongoClient.connect.restore());

  describe('Quando não é passado "name"', () => {
    let response;
    before(async () => {
        response = await chai.request(server).post('/users').send({
          email: 'testing@email.com',
          password: 'myPassword',
        })
    });

    it('retorna o status 400', () => {
      expect(response).to.have.status(400);
    });

    it('retorna um object no body', () => {
      expect(response.body).to.be.an('object')
  })

  it('objeto de resposta possui a propriedade "message"', () => {
      expect(response.body).to.have.property('message');
  });

    it('retorna a mensagem "Invalid entries. Try again."', () => {
      expect(response.body.message).to.be.equal('Invalid entries. Try again.');
    });
  });

  describe('Quando não é passado "email"', () => {
    let response;
    before(async () => {
        response = await chai.request(server).post('/users').send({
          name: 'John Doe',
          password: 'myPassword',
        })
    });

    it('retorna o status 400', () => {
      expect(response).to.have.status(400);
    });

    it('retorna um object no body', () => {
      expect(response.body).to.be.an('object')
  })

  it('objeto de resposta possui a propriedade "message"', () => {
      expect(response.body).to.have.property('message');
  });

    it('retorna a mensagem "Invalid entries. Try again."', () => {
      expect(response.body.message).to.be.equal('Invalid entries. Try again.');
    });
  });

  describe('Quando não é passado "password"', () => {
    let response;
    before(async () => {
        response = await chai.request(server).post('/users').send({
          name: 'John Doe',
          email: 'johndoe@testing.com',
        })
    });

    it('retorna o status 400', () => {
      expect(response).to.have.status(400);
    });

    it('retorna um object no body', () => {
      expect(response.body).to.be.an('object')
  })

  it('objeto de resposta possui a propriedade "message"', () => {
      expect(response.body).to.have.property('message');
  });

    it('retorna a mensagem "Invalid entries. Try again."', () => {
      expect(response.body.message).to.be.equal('Invalid entries. Try again.');
    });
  });

  describe('Quando "email" é inválido', () => {
    let response;
    before(async () => {
        response = await chai.request(server).post('/users').send({
          name: 'John Doe',
          email: 'johndoe.com',
          password: 'myPassword',
        })
    });

    it('retorna o status 400', () => {
      expect(response).to.have.status(400);
    });

    it('retorna um object no body', () => {
      expect(response.body).to.be.an('object')
  })

  it('objeto de resposta possui a propriedade "message"', () => {
      expect(response.body).to.have.property('message');
  });

    it('retorna a mensagem "Invalid entries. Try again."', () => {
      expect(response.body.message).to.be.equal('Invalid entries. Try again.');
    });
  });

  describe('Quando o payload é válido', () => {
    let response;
    before(async () => {
        response = await chai.request(server).post('/users').send({
          name: 'John Doe',
          email: 'johndoe@testingmail.com',
          password: 'myPassword',
        })
    });

    it('retorna o status 201', () => {
      expect(response).to.have.status(201);
    });

    it('retorna om object no body', () => {
      expect(response.body).to.be.an('object');
    });

    it('o object tem a propriedade "user"', () => {
      expect(response.body).to.have.property('user');
    });

    it('dentro de user há um objeto com as propriedades "name", "email", "role" e "_id"', () => {
      expect(response.body.user).to.have.keys("name", "email", "role", "_id");
    });

    it('o valor de "role" deve ser "user"', () => {
      expect(response.body.user.role).to.be.equal('user');
    });
  });
});

describe('POST /login', () => {
  let connection;

  before( async () => {
    connection = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connection);
  });

  after(() => MongoClient.connect.restore());

  describe('Quando o campo "email" não é preenchido', () => {
    let response;
    before(async () => {
        response = await chai.request(server).post('/login').send({
          password: 'myPassword',
        })
    });

    it('retorna o status 401', () => {
      expect(response).to.have.status(401);
    });

    it('retorna a mensagem "All fields must be filled"', () => {
      expect(response.body.message).to.be.equal('All fields must be filled');
    });
  });

  describe('Quando o campo "password" não é preenchido', () => {
    let response;
    before(async () => {
        response = await chai.request(server).post('/login').send({
          email: 'testing@email.com',
        })
    });

    it('retorna o status 401', () => {
      expect(response).to.have.status(401);
    });

    it('retorna a mensagem "All fields must be filled"', () => {
      expect(response.body.message).to.be.equal('All fields must be filled');
    });
  });

  describe('Quando oas informações do payload são inválidas', () => {
    let response;
    before(async () => {
        response = await chai.request(server).post('/login').send({
          email: 'testing@mail.com',
          password: 'myPassword',
        })
    });


  });

  describe('Quando o payload é válido', () => {
    let response;
    before(async () => {
      await chai.request(server).post('/users').send({
        name: 'John Doe',
        email: 'johndoe@testingmail.com',
        password: 'myPassword',
      });
      response = await chai.request(server).post('/login').send({
        email: 'johndoe@testingmail.com',
        password: 'myPassword',
      });
    });

    it('retorna o status 200 ok', () => {
      expect(response).to.have.status(200);
    });

    it('retorna um objeto', () => {
      expect(response.body).to.have.property('token');
    });

    it('a propriedade token não é vazia', () => {
      expect(response.body.token).not.to.be.empty;
    })
  });
});