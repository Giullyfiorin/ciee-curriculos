const {
  extrairDadosCurriculo
} = require("../services/pdfService");

const receberCurriculo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        mensagem: "Nenhum arquivo PDF foi enviado."
      });
    }

    const dados = await extrairDadosCurriculo(
      req.file.buffer
    );

    return res.status(200).json({
      mensagem: "Currículo lido com sucesso.",
      dados: {
        nomeCompleto: dados.nomeCompleto,
        email: dados.email,
        telefone: dados.telefone
      }
    });
  } catch (erro) {
    console.error("Erro ao ler currículo:", erro);

    return res.status(422).json({
      mensagem:
        "Não foi possível ler o currículo. Preencha os dados manualmente."
    });
  }
};

module.exports = {
  receberCurriculo
};