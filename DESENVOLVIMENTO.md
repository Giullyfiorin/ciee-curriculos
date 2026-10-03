# Desenvolvimento do Projeto

## Como organizei o desenvolvimento

Comecei o projeto entendendo primeiro o que precisava ser entregue e escolhendo as tecnologias que eu já tinha mais familiaridade.

Para o frontend escolhi React com Vite, para o backend usei Node.js com Express e para o banco de dados SQL Server.

Fui fazendo o projeto por etapas. Primeiro fiz o backend e o cadastro básico, depois comecei a parte de leitura do currículo em PDF. Quando essa parte estava funcionando, fiz a interface em React e conectei o frontend com o backend.

Depois adicionei a listagem e os detalhes dos candidatos e, por último, configurei a persistência no SQL Server, fiz alguns testes e organizei a documentação.

Preferi fazer uma parte de cada vez e testar antes de continuar, porque assim ficou mais fácil descobrir onde estava o problema quando alguma coisa não funcionava.

## Cadastro de candidatos

O cadastro pode ser feito de duas formas: manualmente ou usando um currículo em PDF.

No cadastro manual, o usuário preenche o formulário normalmente. Nome completo e e-mail são obrigatórios e também existe uma validação simples para verificar o formato do e-mail.

Depois de cadastrar, os dados são enviados para o backend e salvos no SQL Server.

Também fiz uma listagem dos candidatos cadastrados e uma opção para visualizar os dados completos de cada candidato.

## Importação do currículo

Uma das partes principais do desafio era permitir o envio de um currículo em PDF.

Usei o Multer no backend para receber o arquivo e coloquei um limite de 5 MB. O sistema também verifica se o arquivo enviado é um PDF.

Para ler o conteúdo usei a biblioteca `pdf-parse`.

Depois que o texto é extraído, o sistema tenta encontrar nome, e-mail e telefone. Para isso usei regras simples, como padrões para encontrar o e-mail e o telefone no texto.

Quando alguma informação é encontrada, ela volta para o frontend e preenche o mesmo formulário usado no cadastro manual.

Os campos continuam editáveis, então a pessoa pode corrigir ou completar qualquer informação antes de salvar.

Também mantive o PDF como opcional. Se a leitura não funcionar, ainda é possível preencher o formulário manualmente e fazer o cadastro normalmente.

## Banco de dados

No começo usei dados em memória para conseguir desenvolver e testar as outras partes enquanto ainda não tinha terminado a configuração do banco.

Depois substituí essa parte pelo SQL Server.

Criei o banco `CieeCurriculos` e a tabela `Candidatos`. Também criei o arquivo `init.sql` para facilitar a criação do banco e da tabela em outro computador.

As informações de conexão ficam em um arquivo `.env`, que não é enviado para o GitHub. No projeto deixei apenas o `.env.example`, mostrando quais informações precisam ser configuradas.

Depois da integração, testei a persistência cadastrando um candidato, desligando e iniciando novamente o backend. O candidato continuou aparecendo na lista, confirmando que estava salvo no banco.

## Dificuldades que encontrei

A parte que mais deu trabalho foi a configuração do SQL Server.

Primeiro tentei utilizar LocalDB. Ele funcionava no computador, mas tive dificuldade para fazer a conexão dele com o Node.js da forma que o projeto estava configurado.

Também tentei uma alternativa usando `msnodesqlv8`, mas ela exigia componentes adicionais de compilação no computador. Como a ideia era manter o projeto simples, decidi não continuar por esse caminho.

No final instalei e configurei o SQL Server Express. Precisei habilitar o TCP/IP, configurar a porta 1433, reiniciar o serviço e ajustar a autenticação.

Depois disso consegui testar a conexão diretamente e então liguei o banco ao backend.

Outro problema aconteceu no arquivo `.env`. A senha que eu estava usando possuía o caractere `#` e o valor não estava sendo lido completamente. Descobri que precisava colocar a senha entre aspas. Depois dessa alteração a conexão funcionou.

Também tive um problema no CSS quando estava adicionando a tela de detalhes do candidato. Uma regra acabou alterando outras partes da página. Corrigi deixando o seletor mais específico.

Esses problemas acabaram sendo úteis porque me fizeram entender melhor a configuração do banco, as variáveis de ambiente e a organização do CSS.

## Testes

Durante o desenvolvimento fiz vários testes manualmente pelo navegador e pela API.

Testei principalmente:

- cadastro manual;
- campos obrigatórios;
- e-mail inválido;
- envio de currículo;
- preenchimento dos campos através do PDF;
- edição dos dados depois da leitura;
- cadastro no banco;
- listagem dos candidatos;
- visualização dos detalhes;
- persistência depois de reiniciar o backend;
- arquivos inválidos.

Também adicionei testes automatizados simples usando Jest.

Os testes verificam se a validação aceita um e-mail válido e rejeita um formato de e-mail inválido.

Preferi fazer poucos testes que estivessem relacionados com uma regra realmente usada no projeto, em vez de aumentar muito a estrutura apenas para criar mais testes.

Também deixei um currículo fictício na pasta `exemplos` para que a importação possa ser testada sem utilizar dados pessoais.

## Uso de Inteligência Artificial

Usei o ChatGPT, com o modelo GPT-5.6 Sol, como ferramenta de apoio durante o desenvolvimento.

Usei principalmente para tirar dúvidas, entender erros, discutir como organizar algumas partes do projeto e revisar soluções antes de testar.

Alguns exemplos aproximados de perguntas que fiz durante o desenvolvimento foram:

> "Vamos fazer esse desafio usando React, Node e SQL Server. Quero entender cada etapa."

> "Como podemos fazer o PDF preencher o mesmo formulário do cadastro manual?"

> "Como limitar o arquivo PDF a 5 MB?"

> "A conexão com o SQL Server está dando erro. Como podemos descobrir o problema?"

> "Quero fazer testes simples, sem aumentar muito a complexidade do projeto."

A IA também ajudou com exemplos de código e comandos, mas eu fui executando e testando as sugestões no meu ambiente.

Nem tudo que foi sugerido acabou sendo utilizado.

Por exemplo, tentei primeiro usar LocalDB, mas a conexão com o Node não funcionou como esperado. Depois foi considerada a biblioteca `msnodesqlv8`, mas ela exigia outras ferramentas instaladas no computador e preferi não seguir com essa solução.

Também chegamos a considerar separar