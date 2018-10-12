require('dotenv').config();

module.exports = {
  "postgres": {
    host: 'localhost',
    database: process.env.PG_DB,
    password: process.env.PG_PW,
    user: process.env.PG_USER,
  }
}
