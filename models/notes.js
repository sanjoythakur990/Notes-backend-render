const { DataTypes } = require('sequelize');
const sequelize = require('../dbConnection'); 


const Note = sequelize.define('Note', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, 
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW, 
      onUpdate: DataTypes.NOW,     
    },
  }, {
    timestamps: false,  // Disabling automatic `createdAt` and `updatedAt` by Sequelize
    underscored: true,
  });



module.exports = Note;
