const fs = require('fs');
require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.MYSQL_DB, process.env.MYSQL_USER, process.env.MYSQL_PW, {
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,  // Remote database port
  dialect: 'mysql',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  dialectOptions: {
    ssl: {
      ca: fs.readFileSync(process.env.SSL_CERT_PATH),  
      require: true,
      rejectUnauthorized: true  // Use true if Aiven requires strict SSL validation
    }
  }
});

sequelize.authenticate()
  .then(() => {
    // console.log(__dirname);
    console.log('Secure connection to the Aiven-hosted MySQL database has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;

