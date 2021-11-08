const { ObjectID } = require('mongodb');
const getConnection = require('./connection');

// Cria uma receita
const create = async (name, ingredients, preparation, userId) => {
  const recipesCollection = await getConnection().then((db) => db.collection('recipes'));
  const response = await recipesCollection.insertOne({ name, ingredients, preparation, userId });

  return {
    _id: response.insertedId,
    name,
    ingredients,
    preparation,
    userId,
  };
};

// Lista todas as receitas cadastradas
const getAll = async () => {
  const recipesCollection = await getConnection().then((db) => db.collection('recipes'));
  const response = await recipesCollection.find().toArray();

  return response;
};

// Busca uma receita pelo id
const getOne = async (id) => {
  const recipesCollection = await getConnection().then((db) => db.collection('recipes'));
  const response = await recipesCollection.findOne({ _id: new ObjectID(id) });

  return response;
};

// Edita a receita pelo id
const updateOne = async (id, name, ingredients, preparation) => {
  const recipesCollection = await getConnection().then((db) => db.collection('recipes'));

  try {
    const response = await recipesCollection.updateOne(
      { _id: id },
      { $set: { name, ingredients, preparation } },
      );

      if (response) return true;

      return false;
    } catch (err) {
      return err;
    }
};

// Deleta a receita com o id informado
const deleteOne = async (id) => {
  const recipesCollection = await getConnection().then((db) => db.collection('recipes'));

    try {
      const response = await recipesCollection.deleteOne({ _id: id });
      if (response) return true;

      return false;
    } catch (err) {
      return err;
    }
};

const addImage = async (id, image) => {
  const recipesCollection = await getConnection()
    .then((db) => db.collection('recipes'));

  try {
    const response = await recipesCollection.updateOne(
      { _id: id },
      { $set: { image: `localhost:3000/src/uploads/${image}` } },
    );

    if (response) return true;

    return false;
  } catch (err) {
    return err;
  }
};

module.exports = {
  create,
  getAll,
  getOne,
  updateOne,
  deleteOne,
  addImage,
}; 