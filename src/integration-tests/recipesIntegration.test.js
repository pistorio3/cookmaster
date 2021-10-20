const chai = require('chai');
const chaiHttp = require('chai-http');
const MongoClient = require('mongodb/lib/mongo_client');
const sinon = require('sinon');
const { getConnection } = require('./connectionMock');
const server = require('../api/app');

chai.use(chaiHttp);
const { expect } = chai;

describe('', () => {
});