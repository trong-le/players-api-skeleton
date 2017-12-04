module.exports = {
  host: process.env.HOST || 'localhost',
  user: 'postgres',
  database: 'postgres',
  password: process.env.PASSWORD || 'postgres',
  port: process.env.PORT || 5432
};