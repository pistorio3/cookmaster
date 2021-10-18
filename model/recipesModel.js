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

module.exports = {
  create,
}; 