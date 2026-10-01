let candidatos = [];

const emailValido = (email) => {
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regexEmail.test(email);
};

const listarCandidatos = (req, res) => {
  return res.status(200).json({
    candidatos
  });
};

const buscarCandidatoPorId = (req, res) => {
  const id = Number(req.params.id);

  const candidato = candidatos.find(
    (candidato) => candidato.id === id
  );

  if (!candidato) {
    return res.status(404).json({
      mensagem: "Candidato não encontrado."
    });
  }

  return res.status(200).json({
    candidato
  });
};

const cadastrarCandidato = (req, res) => {
  const {
    nomeCompleto,
    email,
    telefone,
    areaInteresse,
    resumoProfissional
  } = req.body;

  if (!nomeCompleto || !email) {
    return res.status(400).json({
      mensagem: "Nome completo e e-mail são obrigatórios."
    });
  }

  if (!emailValido(email)) {
    return res.status(400).json({
      mensagem: "Informe um e-mail válido."
    });
  }

  const novoCandidato = {
    id: candidatos.length + 1,
    nomeCompleto: nomeCompleto.trim(),
    email: email.trim(),
    telefone: telefone?.trim() || "",
    areaInteresse: areaInteresse?.trim() || "",
    resumoProfissional: resumoProfissional?.trim() || ""
  };

  candidatos.push(novoCandidato);

  return res.status(201).json({
    mensagem: "Candidato cadastrado com sucesso.",
    candidato: novoCandidato
  });
};

module.exports = {
  listarCandidatos,
  buscarCandidatoPorId,
  cadastrarCandidato
};