// Importação da conexão com o DB
const getConnection = require('./connection');

// Cria um novo usuário
const create = async (name, email, password, role) => {
  const usersCollection = await getConnection().then((db) => db.collection('users'));
  const response = await usersCollection.insertOne({ name, email, password, role });

  return {
    user: {
      _id: response.insertedId,
      name,
      email,
      role,
    },
  };
};

// Realiza o login
const login = async (email, password) => {
  const usersCollection = await getConnection().then((db) => db.collection('users'));
  const response = await usersCollection.findOne({ email, password });

  return response;
};

// Busca um usuário pelo email cadastrado
const findByEmail = async (email) => {
  const usersCollection = await getConnection().then((db) => db.collection('users'));
  const response = await usersCollection.findOne({ email });

  return response;
};

// Exportação padrão
module.exports = {
  create,
  login,
  findByEmail,
}; 