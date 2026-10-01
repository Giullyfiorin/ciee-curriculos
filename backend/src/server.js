const express = require("express");
const cors = require("cors");

const candidatoRoutes = require("./routes/candidatoRoutes");
const curriculoRoutes = require("./routes/curriculoRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
const PORT = 3000;

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    mensagem: "API de cadastro de candidatos funcionando!"
  });
});

app.use("/api/candidatos", candidatoRoutes);
app.use("/api/curriculos", curriculoRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});