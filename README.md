# Cadastro de Candidatos com Importação de Currículo

Aplicação web desenvolvida para cadastro de candidatos, permitindo o preenchimento manual dos dados ou a importação de um currículo em PDF para preenchimento automático de algumas informações.

## Funcionalidades

- Cadastro manual de candidatos
- Importação opcional de currículo em PDF
- Extração de nome, e-mail e telefone do currículo
- Preenchimento automático e edição dos dados extraídos
- Validação dos campos obrigatórios
- Validação de formato de e-mail
- Limite de 5 MB para arquivos PDF
- Listagem dos candidatos cadastrados
- Visualização dos detalhes de um candidato
- Persistência dos dados no SQL Server
- Tratamento de erros de leitura do currículo e cadastro

Caso a leitura do PDF não seja possível, o candidato ainda pode realizar o cadastro manualmente.

## Tecnologias utilizadas

### Frontend

- React
- Vite
- JavaScript
- CSS
- Fetch API

### Backend

- Node.js
- Express
- Multer
- pdf-parse
- mssql
- dotenv

### Banco de dados

- Microsoft SQL Server

### Testes

- Jest

## Estrutura do projeto

```text
ciee-curriculos/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── tests/
│   │   └── utils/
│   ├── .env.example
│   ├── package.json
│   └── package-lock.json
├── frontend/
├── exemplos/
│   └── curriculo_ficticio.pdf
├── init.sql
├── README.md
└── DESENVOLVIMENTO.md
```

## Pré-requisitos

Para executar o projeto é necessário ter instalado:

- Node.js
- npm
- SQL Server
- Git

## Configuração do banco de dados

O arquivo `init.sql`, localizado na raiz do projeto, cria o banco de dados `CieeCurriculos` e a tabela `Candidatos`.

Execute esse script em uma instância do SQL Server antes de iniciar o backend.

A aplicação utiliza as seguintes informações através de variáveis de ambiente:

```env
DB_SERVER=localhost
DB_PORT=1433
DB_DATABASE=CieeCurriculos
DB_USER=seu_usuario
DB_PASSWORD="sua_senha"
```

Na pasta `backend`, existe o arquivo `.env.example`.

Crie uma cópia chamada `.env` e informe as credenciais da sua instância do SQL Server.

O arquivo `.env` não deve ser enviado ao repositório.

O SQL Server também deve estar configurado para aceitar a forma de autenticação correspondente às credenciais utilizadas e disponibilizar a conexão TCP/IP na porta configurada.

## Executando o backend

Entre na pasta:

```bash
cd backend
```

Instale as dependências:

```bash
npm install
```

Inicie a API:

```bash
npm start
```

Por padrão, o backend será disponibilizado em:

```text
http://localhost:3000
```

## Executando o frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

O Vite exibirá no terminal o endereço local do frontend, normalmente:

```text
http://localhost:5173
```

## Executando os testes

Na pasta `backend`:

```bash
npm test
```

Foram adicionados testes automatizados para a validação de e-mail utilizada no cadastro de candidatos.

## Importação de currículo

A importação do currículo é opcional.

O backend recebe o PDF utilizando Multer e realiza a extração do texto com `pdf-parse`.

A partir do texto extraído, a aplicação tenta identificar:

- nome
- e-mail
- telefone

Os dados encontrados são enviados ao frontend e utilizados para preencher o mesmo formulário do cadastro manual. O usuário pode alterar qualquer informação antes de salvar.

Existe um currículo com dados fictícios na pasta `exemplos` para demonstração da funcionalidade.

## Limitações da extração

A extração utiliza regras simples e determinísticas sobre o texto do PDF.

Por isso, currículos com layouts muito diferentes, PDFs digitalizados como imagem, textos em posições incomuns ou formatos inesperados podem não ter todos os dados identificados corretamente.

A aplicação não depende da extração para concluir o cadastro: caso a leitura falhe ou algum campo não seja identificado, o formulário continua disponível para preenchimento manual.

## API

Principais endpoints:

```text
GET  /api/candidatos
GET  /api/candidatos/:id
POST /api/candidatos
POST /api/curriculos/extrair
```

## Segurança e configuração

As consultas de cadastro e busca utilizam parâmetros no acesso ao SQL Server.

Credenciais do banco de dados não são armazenadas diretamente no código-fonte. O projeto utiliza variáveis de ambiente e disponibiliza somente `.env.example` como referência.

## Documentação do desenvolvimento

As decisões técnicas, uso de IA, dificuldades encontradas, validações realizadas e possíveis melhorias estão descritos em `DESENVOLVIMENTO.md`.