const getConnection = require('./connection');

const create = async (name, email, password, role) => {
  const productsCollection = await getConnection()
    .then((db) => db.collection('users'));

  const response = await productsCollection
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

const findByEmail = async (email) => {
  const productsCollection = await getConnection()
    .then((db) => db.collection('users'));

  const response = await productsCollection
    .findOne({ email });

  return response;
};

module.exports = {
  create,
  findByEmail,
}; 