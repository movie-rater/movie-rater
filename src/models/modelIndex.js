'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const movieModel = require('./movie');
const userModel = require('../auth/usersModel');
const Collection = require('./data-collections');

const DATABASE_URL = process.env.DATABASE_URL || 'sqlite:memory:';

const sequelize = new Sequelize(DATABASE_URL);
const movies = movieModel(sequelize, DataTypes);

module.exports = {
  db: sequelize,
  movies: new Collection(movies),
  users: userModel(sequelize, DataTypes),
};
