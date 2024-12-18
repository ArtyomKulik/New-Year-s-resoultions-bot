require('dotenv').config()


module.exports ={
  "development": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASS,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "dialect": "postgres"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "production": {
    "username": process.env.DB_USERNAME_PROD,
    "password": process.env.DB_PASS_PROD,
    "database": process.env.DB_NAME_PROD,
    "host": process.env.DB_HOST_PROD,
    "dialect": "postgres"
  }
}
