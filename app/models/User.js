const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');


const User = sequelize.define('User', {
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
        type: DataTypes.STRING,
    },
    login: { 
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    created: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'Users',
    timestamps: false
  });

  module.exports = User;