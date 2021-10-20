const getConnection = require('./connection');

const create = async (name, email, password, role) => {
  const usersCollection = await getConnection()
    .then((db) => db.collection('users'));

  const response = await usersCollection
    .insertOne({ name, email, password, role });

  return {
    user: {
      _id: response.insertedId,
      name,
      email,
      role,
    },
  };
};

const login = async (email, password) => {
  const usersCollection = await getConnection()
    .then((db) => db.collection('users'));

  const response = await usersCollection
    .findOne({ email, password });

  return response;
};

const findByEmail = async (email) => {
  const usersCollection = await getConnection()
    .then((db) => db.collection('users'));

  const response = await usersCollection
    .findOne({ email });

  return response;
};

module.exports = {
  create,
  login,
  findByEmail,
}; 