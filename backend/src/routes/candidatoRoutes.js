const express = require("express");

const {
  listarCandidatos,
  buscarCandidatoPorId,
  cadastrarCandidato
} = require("../controllers/candidatoController");

const router = express.Router();

router.get("/", listarCandidatos);

router.get("/:id", buscarCandidatoPorId);

router.post("/", cadastrarCandidato);

module.exports = router;