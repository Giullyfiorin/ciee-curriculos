const { PDFParse } = require("pdf-parse");

const extrairDadosCurriculo = async (buffer) => {
  const parser = new PDFParse({
    data: buffer
  });

  try {
    const resultado = await parser.getText();
    const texto = resultado.text || "";

    // Procura um e-mail no texto
    const emailRegex =
      /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;

    const emailEncontrado = texto.match(emailRegex);

    // Procura formatos comuns de telefone brasileiro
    const telefoneRegex =
      /(?:\+?55\s*)?(?:\(?\d{2}\)?\s*)?(?:9\s*)?\d{4}[-\s]?\d{4}/;

    const telefoneEncontrado = texto.match(telefoneRegex);

    // Heurística simples para o nome:
    // procura a primeira linha útil que não seja e-mail ou telefone
    const linhas = texto
      .split("\n")
      .map((linha) => linha.trim())
      .filter((linha) => linha.length > 0);

    const nomeEncontrado = linhas.find((linha) => {
      const possuiEmail = emailRegex.test(linha);
      const possuiTelefone = telefoneRegex.test(linha);

      return (
        !possuiEmail &&
        !possuiTelefone &&
        linha.length >= 3 &&
        linha.length <= 100
      );
    });

    return {
      nomeCompleto: nomeEncontrado || "",
      email: emailEncontrado?.[0] || "",
      telefone: telefoneEncontrado?.[0] || "",
      texto
    };
  } finally {
    await parser.destroy();
  }
};

module.exports = {
  extrairDadosCurriculo
};