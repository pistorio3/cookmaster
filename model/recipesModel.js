const { ObjectID } = require('mongodb');
const getConnection = require('./connection');

const create = async (name, ingredients, preparation) => {
  const recipesCollection = await getConnection()
    .then((db) => db.collection('recipes'));

  const response = await recipesCollection
    .insertOne({ name, ingredients, preparation });

  return {
    _id: response.insertedId,
    name,
    ingredients,
    preparation,
  };
};

const getAll = async () => {
  const recipesCollection = await getConnection()
    .then((db) => db.collection('recipes'));

  const response = await recipesCollection
    .find().toArray();

  return response;
};

const getOne = async (id) => {
  const recipesCollection = await getConnection()
    .then((db) => db.collection('recipes'));

  const response = await recipesCollection
    .findOne({ _id: new ObjectID(id) });

  return response;
};

module.exports = {
  create,
  getAll,
  getOne,
}; 