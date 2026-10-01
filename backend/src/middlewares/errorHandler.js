const multer = require("multer");

const errorHandler = (erro, req, res, next) => {
  console.error("Erro:", erro.message);

  if (erro instanceof multer.MulterError) {
    if (erro.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        mensagem: "O arquivo deve ter no máximo 5 MB."
      });
    }

    return res.status(400).json({
      mensagem: "Erro ao enviar o arquivo."
    });
  }

  if (erro.message === "INVALID_FILE_TYPE") {
    return res.status(400).json({
      mensagem: "Arquivo inválido. Envie somente arquivos PDF."
    });
  }

  return res.status(500).json({
    mensagem: "Ocorreu um erro interno no servidor."
  });
};

module.exports = errorHandler;