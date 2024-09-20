require('dotenv').config();
const { Sequelize } = require('sequelize');


const sequelize = new Sequelize('notes_app', 'root', process.env.MYSQL_PW, {
  host: 'localhost',  
  dialect: 'mysql',   
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  }     
});


sequelize.authenticate()
  .then(() => {
    console.log('Connection to the MySQL database has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });


module.exports = sequelize;
