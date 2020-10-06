const { DataTypes } = require('sequelize');
const sequelize = require('../db/sequelize');
const Timer = require('./Timer');

const DaySession = sequelize.define('DaySession', {
    date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    duration: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    tableName: 'DaySession',
    timestamps: false
});

module.exports = DaySession; 