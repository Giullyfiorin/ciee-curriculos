const API_URL = "http://localhost:3000/api";

export const listarCandidatos = async () => {
  const resposta = await fetch(`${API_URL}/candidatos`);

  const resultado = await resposta.json();

  if (!resposta.ok) {
    throw new Error(
      resultado.mensagem || "Não foi possível carregar os candidatos."
    );
  }

  return resultado;
};

export const buscarCandidatoPorId = async (id) => {
  const resposta = await fetch(`${API_URL}/candidatos/${id}`);

  const resultado = await resposta.json();

  if (!resposta.ok) {
    throw new Error(
      resultado.mensagem || "Não foi possível carregar o candidato."
    );
  }

  return resultado;
};

export const cadastrarCandidato = async (dados) => {
  const resposta = await fetch(`${API_URL}/candidatos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  });

  const resultado = await resposta.json();

  if (!resposta.ok) {
    throw new Error(
      resultado.mensagem || "Não foi possível cadastrar o candidato."
    );
  }

  return resultado;
};

export const extrairCurriculo = async (arquivo) => {
  const formData = new FormData();

  formData.append("curriculo", arquivo);

  const resposta = await fetch(`${API_URL}/curriculos/extrair`, {
    method: "POST",
    body: formData,
  });

  const resultado = await resposta.json();

  if (!resposta.ok) {
    throw new Error(
      resultado.mensagem || "Não foi possível ler o currículo."
    );
  }

  return resultado;
};