const envConfig = require('../database/envConfig');

let knex = require('knex')({
  client: 'mysql2',
  connection: {
    host: envConfig.host,
    user: envConfig.user,
    password: envConfig.password,
    database: envConfig.database,   
   }
}); 
module.exports = knex