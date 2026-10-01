const express = require("express");

const upload = require("../middlewares/upload");

const {
  receberCurriculo
} = require("../controllers/curriculoController");

const router = express.Router();

router.post(
  "/extrair",
  upload.single("curriculo"),
  receberCurriculo
);

module.exports = router;