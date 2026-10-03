const { sql, conectarBanco } = require("../config/database");
const { emailValido } = require("../utils/validacao");

const listarCandidatos = async (req, res, next) => {
  try {
    const pool = await conectarBanco();

    const resultado = await pool.request().query(`
      SELECT
        id,
        nomeCompleto,
        email,
        telefone,
        areaInteresse,
        resumoProfissional,
        criadoEm
      FROM dbo.Candidatos
      ORDER BY id DESC
    `);

    return res.status(200).json({
      candidatos: resultado.recordset,
    });
  } catch (erro) {
    next(erro);
  }
};

const buscarCandidatoPorId = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        mensagem: "ID de candidato inválido.",
      });
    }

    const pool = await conectarBanco();

    const resultado = await pool
      .request()
      .input("id", sql.Int, id)
      .query(`
        SELECT
          id,
          nomeCompleto,
          email,
          telefone,
          areaInteresse,
          resumoProfissional,
          criadoEm
        FROM dbo.Candidatos
        WHERE id = @id
      `);

    const candidato = resultado.recordset[0];

    if (!candidato) {
      return res.status(404).json({
        mensagem: "Candidato não encontrado.",
      });
    }

    return res.status(200).json({
      candidato,
    });
  } catch (erro) {
    next(erro);
  }
};

const cadastrarCandidato = async (req, res, next) => {
  try {
    const {
      nomeCompleto,
      email,
      telefone,
      areaInteresse,
      resumoProfissional,
    } = req.body;

    if (!nomeCompleto?.trim() || !email?.trim()) {
      return res.status(400).json({
        mensagem: "Nome completo e e-mail são obrigatórios.",
      });
    }

    if (!emailValido(email.trim())) {
      return res.status(400).json({
        mensagem: "Informe um e-mail válido.",
      });
    }

    const pool = await conectarBanco();

    const resultado = await pool
      .request()
      .input("nomeCompleto", sql.NVarChar(200), nomeCompleto.trim())
      .input("email", sql.NVarChar(255), email.trim())
      .input("telefone", sql.NVarChar(30), telefone?.trim() || null)
      .input(
        "areaInteresse",
        sql.NVarChar(150),
        areaInteresse?.trim() || null
      )
      .input(
        "resumoProfissional",
        sql.NVarChar(sql.MAX),
        resumoProfissional?.trim() || null
      )
      .query(`
        INSERT INTO dbo.Candidatos (
          nomeCompleto,
          email,
          telefone,
          areaInteresse,
          resumoProfissional
        )
        OUTPUT
          INSERTED.id,
          INSERTED.nomeCompleto,
          INSERTED.email,
          INSERTED.telefone,
          INSERTED.areaInteresse,
          INSERTED.resumoProfissional,
          INSERTED.criadoEm
        VALUES (
          @nomeCompleto,
          @email,
          @telefone,
          @areaInteresse,
          @resumoProfissional
        )
      `);

    return res.status(201).json({
      mensagem: "Candidato cadastrado com sucesso.",
      candidato: resultado.recordset[0],
    });
  } catch (erro) {
    next(erro);
  }
};

module.exports = {
  listarCandidatos,
  buscarCandidatoPorId,
  cadastrarCandidato,
};