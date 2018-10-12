require('dotenv').config();

module.exports = {
  "postgres": {
    host: process.env.PG_HOST,
    database: process.env.PG_DB,
    password: process.env.PG_PW,
    user: process.env.PG_USER,
  }
}
