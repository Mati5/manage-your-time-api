const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');
const DaySession = require('./DaySession.js');
const User = require('./User');

const Timer = sequelize.define('Timer', {
    title: {
        type: DataTypes.STRING,
    },
    description: {
        type: DataTypes.STRING,
    },
    created: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    totalDuration: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
  }, {
    tableName: 'Timer',
    timestamps: false
});

Timer.hasMany(DaySession, { onDelete: 'cascade' });
User.hasMany(Timer);

module.exports = Timer;