## Dependencias - O que Instalar Antes de baixar o projeto?

1- Baixar o NodeJs e o NPM:

Baixar no site: https://nodejs.org/pt (Ja vem com o NPM junto)

Apos baixar verifique a versão do Node e do Npm, no Prompt de comando rode:
node -v
npm -v


2- Baixar o MySql e instalar:

* Baixar o Mysql e intalar o executavel do site:
https://dev.mysql.com/downloads/installer/

* No passo de configuração, defina:

MySQL Installer for Windows (versão completa, pois já inclui o MySQL Server e Workbench).

    Modo de autenticação: Deixe "Use Strong Password Encryption".
    Usuário root: Crie o usuario admin e a senha admin123( ou mantenha root e lembre-se da senha)
    Porta: Deixe 3306 (ou escolha outra e lembre-se dela).
    Criação de um novo usuário: Opcional, nao precisa
    Finalize a instalação.

* Inicie o MySQL Workbench(programa)
   Clique no ícone de nova conexão e use:
    Host: localhost
    Usuário: root (ou outro que criou)
    Senha: (aquela definida na instalação)
    Conecte-se e pronto!

* Crie a tabela(Schema) no banco, que é usada pelo Nodejs:

  Entre na conexão que você criou no MySql Workbench
  Clique no simbolo de "New Schema" e coloque o nome word_game e clique em apply

Pronto, seu banco de dados Mysql está configurado para o projeto WordGame


## Instalação do projeto

1- Crie uma pasta onde você deseja baixar o projeto, pode ser o nome "Wordgame backend Node"

2- Dentro da pasta, abra o prompt de comando e rode: git clone https://github.com/projetowordgame/wordgamenode.git

3- Depois, entre na pasta desses arquivos baixados e rode o comando: npm install

4- Ainda dentro das pastas dos arquivos, crie o arquivo de nome: .env , ele é um arquivo de texto que contem algumas variaveis de conexão.

Adicione as variaveis nesse arquivo .env:

DB_HOST=localhost
DB_PORT=3306
DB_USER=admin
DB_PASSWORD=admin123
DB_NAME=word_game


--Pronto, seu backend Nodejs(com framework NestJs) está configurado.---

Para rodar o backend, entre na pasta do projeto e rode: npm run start

para sair, use o "Control+c" 

O ambiente Backend usa a porta 3000, portanto, para consultar as APIS é nessa porta

exemplo de consulta de usuarios:
http://localhost:3000/auth/users


## Ferramentas auxiliares para ajudar no desenvolvimento

1- Visual Studio Code: IDE para ajudar a abrir o codigo, modificar e salvar.

2- Postman: ferramenta para testar APIs criadas(opção online ou baixar)



## Documentação do framework NestJs:

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
