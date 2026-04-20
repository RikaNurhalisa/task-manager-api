const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "taskdb",
  password: "123456", // GANTI PASSWORD KAMU
  port: 5432,
});

module.exports = pool;