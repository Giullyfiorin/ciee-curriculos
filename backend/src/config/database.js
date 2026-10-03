const sql = require("mssql");
require("dotenv").config();

const config = {
  server: process.env.DB_SERVER || "localhost",
  port: Number(process.env.DB_PORT) || 1433,
  database: process.env.DB_DATABASE || "CieeCurriculos",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,

  options: {
    encrypt: false,
    trustServerCertificate: true,
  },

  connectionTimeout: 10000,
  requestTimeout: 10000,
};

let pool;

const conectarBanco = async () => {
  try {
    if (pool?.connected) {
      return pool;
    }

    pool = await new sql.ConnectionPool(config).connect();

    console.log("Conexão com SQL Server realizada com sucesso.");

    return pool;
  } catch (erro) {
    console.error("Erro ao conectar com SQL Server:", erro.message);
    throw erro;
  }
};

module.exports = {
  sql,
  conectarBanco,
};