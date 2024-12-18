'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Wish extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Wish.init({
    fileId: DataTypes.STRING,
    userId: DataTypes.BIGINT,
    chatId: DataTypes.BIGINT,
    videoIsSent: DataTypes.BOOLEAN,
    videoIsDeleted: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Wish',
  });
  return Wish;
};