import { useEffect, useState } from "react";
import "./App.css";

import {
  buscarCandidatoPorId,
  cadastrarCandidato,
  extrairCurriculo,
  listarCandidatos,
} from "./services/api";

function App() {
  const [formulario, setFormulario] = useState({
    nomeCompleto: "",
    email: "",
    telefone: "",
    areaInteresse: "",
    resumoProfissional: "",
  });

  const [candidatos, setCandidatos] = useState([]);
  const [candidatoSelecionado, setCandidatoSelecionado] =
    useState(null);

  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("");

  const [salvando, setSalvando] = useState(false);
  const [lendoPdf, setLendoPdf] = useState(false);
  const [carregandoCandidatos, setCarregandoCandidatos] =
    useState(true);
  const [carregandoDetalhes, setCarregandoDetalhes] =
    useState(false);

  const carregarCandidatos = async () => {
    try {
      setCarregandoCandidatos(true);

      const resultado = await listarCandidatos();

      setCandidatos(resultado.candidatos || []);
    } catch (erro) {
      console.error("Erro ao carregar candidatos:", erro);
    } finally {
      setCarregandoCandidatos(false);
    }
  };

  useEffect(() => {
    carregarCandidatos();
  }, []);

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

      await carregarCandidatos();
    } catch (erro) {
      setMensagem(erro.message);
      setTipoMensagem("erro");
    } finally {
      setSalvando(false);
    }
  };

  const abrirDetalhes = async (id) => {
    try {
      setCarregandoDetalhes(true);

      const resultado = await buscarCandidatoPorId(id);

      setCandidatoSelecionado(resultado.candidato);
    } catch (erro) {
      setMensagem(erro.message);
      setTipoMensagem("erro");
    } finally {
      setCarregandoDetalhes(false);
    }
  };

  const fecharDetalhes = () => {
    setCandidatoSelecionado(null);
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

        <section className="card card-listagem">
          <div className="titulo-listagem">
            <div>
              <h2>Candidatos cadastrados</h2>

              <p>
                Consulte os candidatos cadastrados no sistema.
              </p>
            </div>

            <span className="contador">
              {candidatos.length}
            </span>
          </div>

          {carregandoCandidatos ? (
            <p className="estado-listagem">
              Carregando candidatos...
            </p>
          ) : candidatos.length === 0 ? (
            <div className="lista-vazia">
              <strong>Nenhum candidato cadastrado</strong>

              <p>
                Os candidatos cadastrados aparecerão aqui.
              </p>
            </div>
          ) : (
            <div className="lista-candidatos">
              {candidatos.map((candidato) => (
                <article
                  className="candidato"
                  key={candidato.id}
                >
                  <div className="avatar">
                    {candidato.nomeCompleto
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="dados-candidato">
                    <strong>
                      {candidato.nomeCompleto}
                    </strong>

                    <span>{candidato.email}</span>

                    {candidato.areaInteresse && (
                      <small>
                        {candidato.areaInteresse}
                      </small>
                    )}
                  </div>

                  <div className="acoes-candidato">
                    <span className="id-candidato">
                      #{candidato.id}
                    </span>

                    <button
                      type="button"
                      className="botao-detalhes"
                      onClick={() =>
                        abrirDetalhes(candidato.id)
                      }
                      disabled={carregandoDetalhes}
                    >
                      Ver detalhes
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      {candidatoSelecionado && (
        <div
          className="fundo-modal"
          onClick={fecharDetalhes}
        >
          <section
            className="modal-detalhes"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="cabecalho-modal">
              <div>
                <span className="modal-subtitulo">
                  Candidato #{candidatoSelecionado.id}
                </span>

                <h2>
                  {candidatoSelecionado.nomeCompleto}
                </h2>
              </div>

              <button
                type="button"
                className="botao-fechar"
                onClick={fecharDetalhes}
                aria-label="Fechar detalhes"
              >
                ×
              </button>
            </div>

            <div className="detalhes-candidato">
              <div className="item-detalhe">
                <span>E-mail</span>

                <strong>
                  {candidatoSelecionado.email}
                </strong>
              </div>

              <div className="item-detalhe">
                <span>Telefone</span>

                <strong>
                  {candidatoSelecionado.telefone ||
                    "Não informado"}
                </strong>
              </div>

              <div className="item-detalhe">
                <span>Área ou cargo de interesse</span>

                <strong>
                  {candidatoSelecionado.areaInteresse ||
                    "Não informado"}
                </strong>
              </div>

              <div className="item-detalhe item-detalhe-completo">
                <span>Resumo profissional</span>

                <p>
                  {candidatoSelecionado.resumoProfissional ||
                    "Não informado"}
                </p>
              </div>
            </div>

            <div className="rodape-modal">
              <button
                type="button"
                className="botao-fechar-modal"
                onClick={fecharDetalhes}
              >
                Fechar
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;