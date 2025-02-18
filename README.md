<div style="display: flex; justify-content: center; align-items: center;">
  <div style="margin: 10px;">
    <h3 align="center">File Reader</h3>
    <p>
      <a href='https://coveralls.io/github/gabrieelbrazao/file-reader?branch=main'>
        <img src='https://coveralls.io/repos/github/gabrieelbrazao/file-reader/badge.svg?branch=main' alt='Coverage Status' />
      </a>
    </p>
  </div>

  <div style="margin: 10px;">
    <h3 align="center">File Store</h3>
    <p>
      <a href='https://coveralls.io/github/gabrieelbrazao/file-store?branch=main'>
        <img src='https://coveralls.io/repos/github/gabrieelbrazao/file-store/badge.svg?branch=main' alt='Coverage Status' />
      </a>
    </p>
  </div>
</div>

# Desafio Backend 🎯

O desafio contém dois projetos principais: <a href="https://github.com/gabrieelbrazao/file-store">`file-store`</a> e <a href="https://github.com/gabrieelbrazao/file-reader">`file-reader`</a>. Estes projetos são interdependentes e trabalham juntos para processar e armazenar dados de pessoas.

## file-reader ✍️

O `file-reader` é responsável por ler arquivos CSV contendo dados de pessoas e enviar esses dados para o `file-store` processar e armazenar.

### Configuração local 🛠️

1. Clone o repositório.
2. Navegue até o diretório `file-reader`.
3. Crie um arquivo `.env.development.local` baseado no `.env.example` e preencha as variáveis de ambiente necessárias.
4. Execute `yarn install` para instalar as dependências.
5. Execute `yarn start:dev` para iniciar o servidor em modo de desenvolvimento.
6. O projeto rodará em <a href="http://localhost:3000">`http://localhost:3000`</a>.

### Endpoints 📍

- **POST /people/ProcessFromCsv**: Recebe um arquivo CSV contendo dados de pessoas e envia esses dados para o `file-store` processar.

## file-store 📦

O `file-store` é responsável por armazenar os dados de pessoas em um banco de dados MongoDB. Ele também agrupa os dados por estado e mantém uma contagem de pessoas por estado.

### Configuração local 🛠️

1. Clone o repositório.
2. Navegue até o diretório `file-store`.
3. Crie um arquivo `.env.development.local` baseado no `.env.example` e preencha as variáveis de ambiente necessárias.
4. Execute `yarn install` para instalar as dependências.
5. Execute `yarn start:dev` para iniciar o servidor em modo de desenvolvimento.

### Endpoints 📍

- **POST /people**: Recebe dados de pessoas e os armazena no banco de dados.

## Docker 🐳

Ambos os projetos podem ser executados usando Docker. Certifique-se de ter o Docker e o Docker Compose instalados.

### Instruções 📝

1. Navegue até o diretório de cada projeto (`file-store` e `file-reader`).
2. Crie um arquivo `.env` para cada projeto.
   1. file-reader:
      ```
      AMQP_URL=amqp://rabbitmq:5672
      QUEUE_NAME=people_queue
      ```
   2. file-store:
      ```
      AMQP_URL=amqp://rabbitmq:5672
      QUEUE_NAME=people_queue
      MONGO_URL=mongodb://mongo:27017/file-store
      ```
3. Execute `docker-compose up` para iniciar os serviços.
4. O projeto rodará em <a href="http://localhost:3000">`http://localhost:3000`</a>.

⚠️ Como o projeto file-reader se conecta com containers do projeto file-store (MongoDB e RabbitMQ), é aconselhável executar o comando no projeto file-store primeiro. ⚠️
