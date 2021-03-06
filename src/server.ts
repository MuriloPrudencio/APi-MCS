import express from 'express';
import errorHandler from './Middlewares/error-handler.middleware';
import statusRoute from './Routes/status.route';
import usersRoute from './Routes/users.route';
import autorizationRoute from './Routes/autorization.route';
import bearerAuthenticationMiddleware from './Middlewares/bearer-authentication.middleware';


const app = express();

//Configurações da aplicação
app.use(express.json()); //Para aceitar Json nas nossas requisções
app.use(express.urlencoded({ extended: true })); //Para reconhecer o objeto de solicitação recebido como strings

//Configuração das nossas rotas
app.use( bearerAuthenticationMiddleware, usersRoute);
app.use(statusRoute);
app.use(autorizationRoute);

//Configuração dos Handlers de erro
app.use(errorHandler);

//Inicialização do nosso servidor
app.listen(3333, () => {
  console.log('Back-end started in 3333 port!');
});
