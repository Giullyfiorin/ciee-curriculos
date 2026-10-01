import { useState } from "react";
import "./App.css";

import {
  cadastrarCandidato,
  extrairCurriculo,
} from "./services/api";

function App() {
  const [formulario, setFormulario] = useState({
    nomeCompleto: "",
    email: "",
    telefone: "",
    areaInteresse: "",
    resumoProfissional: "",
  });

  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("");

  const [salvando, setSalvando] = useState(false);
  const [lendoPdf, setLendoPdf] = useState(false);

  const atualizarCampo = (event) => {
    const { name, value } = event.target;

    setFormulario((formularioAtual) => ({
      ...formularioAtual,
      [name]: value,
    }));
  };

  const selecionarCurriculo = async (event) => {
    const arquivo = event.target.files[0];

    if (!arquivo) {
      return;
    }

    setMensagem("");

    if (arquivo.type !== "application/pdf") {
      setMensagem("Selecione um arquivo PDF.");
      setTipoMensagem("erro");
      event.target.value = "";
      return;
    }

    const limite = 5 * 1024 * 1024;

    if (arquivo.size > limite) {
      setMensagem("O arquivo deve ter no máximo 5 MB.");
      setTipoMensagem("erro");
      event.target.value = "";
      return;
    }

    setLendoPdf(true);

    try {
      const resultado = await extrairCurriculo(arquivo);

      const dados = resultado.dados;

      setFormulario((formularioAtual) => ({
        ...formularioAtual,

        nomeCompleto:
          dados.nomeCompleto || formularioAtual.nomeCompleto,

        email:
          dados.email || formularioAtual.email,

        telefone:
          dados.telefone || formularioAtual.telefone,
      }));

      setMensagem(
        "Currículo lido com sucesso. Confira os dados antes de salvar."
      );

      setTipoMensagem("sucesso");
    } catch (erro) {
      setMensagem(
        `${erro.message} Você ainda pode preencher o formulário manualmente.`
      );

      setTipoMensagem("erro");
    } finally {
      setLendoPdf(false);
    }
  };

  const enviarFormulario = async (event) => {
    event.preventDefault();

    setMensagem("");
    setSalvando(true);

    try {
      const resultado = await cadastrarCandidato(formulario);

      setMensagem(resultado.mensagem);
      setTipoMensagem("sucesso");

      setFormulario({
        nomeCompleto: "",
        email: "",
        telefone: "",
        areaInteresse: "",
        resumoProfissional: "",
      });
    } catch (erro) {
      setMensagem(erro.message);
      setTipoMensagem("erro");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="pagina">
      <header className="cabecalho">
        <div>
          <h1>Cadastro de Candidatos</h1>

          <p>
            Cadastre manualmente ou importe um currículo em PDF.
          </p>
        </div>
      </header>

      <main className="conteudo">
        <section className="card">
          <h2>Novo candidato</h2>

          <div className="importacao">
            <div>
              <strong>
                {lendoPdf
                  ? "Lendo currículo..."
                  : "Importar currículo"}
              </strong>

              <p>
                Envie um arquivo PDF de até 5 MB para preencher
                nome, e-mail e telefone automaticamente.
              </p>
            </div>

            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={selecionarCurriculo}
              disabled={lendoPdf}
            />
          </div>

          {mensagem && (
            <div className={`mensagem ${tipoMensagem}`}>
              {mensagem}
            </div>
          )}

          <form onSubmit={enviarFormulario}>
            <div className="campo">
              <label htmlFor="nomeCompleto">
                Nome completo <span>*</span>
              </label>

              <input
                id="nomeCompleto"
                name="nomeCompleto"
                type="text"
                value={formulario.nomeCompleto}
                onChange={atualizarCampo}
                placeholder="Digite o nome completo"
                required
              />
            </div>

            <div className="campo">
              <label htmlFor="email">
                E-mail <span>*</span>
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formulario.email}
                onChange={atualizarCampo}
                placeholder="exemplo@email.com"
                required
              />
            </div>

            <div className="campo">
              <label htmlFor="telefone">
                Telefone
              </label>

              <input
                id="telefone"
                name="telefone"
                type="text"
                value={formulario.telefone}
                onChange={atualizarCampo}
                placeholder="(41) 99999-9999"
              />
            </div>

            <div className="campo">
              <label htmlFor="areaInteresse">
                Área ou cargo de interesse
              </label>

              <input
                id="areaInteresse"
                name="areaInteresse"
                type="text"
                value={formulario.areaInteresse}
                onChange={atualizarCampo}
                placeholder="Ex.: Desenvolvimento Front-end"
              />
            </div>

            <div className="campo">
              <label htmlFor="resumoProfissional">
                Resumo profissional
              </label>

              <textarea
                id="resumoProfissional"
                name="resumoProfissional"
                value={formulario.resumoProfissional}
                onChange={atualizarCampo}
                placeholder="Escreva um breve resumo profissional"
                rows="5"
              />
            </div>

            <button
              className="botao-salvar"
              type="submit"
              disabled={salvando || lendoPdf}
            >
              {salvando
                ? "Salvando..."
                : "Salvar candidato"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default App;