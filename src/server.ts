import express from 'express';
import errorHandler from './Middlewares/error-handler.middleware';
import statusRoute from './Routes/status.route';
import usersRoute from './Routes/users.route';


const app = express();

//Configurações da aplicação
app.use(express.json()); //Para aceitar Json nas nossas requisções
app.use(express.urlencoded({ extended: true })); //Para reconhecer o objeto de solicitação recebido como strings

//Configuração das nossas rotas
app.use(usersRoute);
app.use(statusRoute);

//Configuração dos Handlers de erro
app.use(errorHandler);

//Inicialização do nosso servidor
app.listen(3333, () => {
  console.log('Back-end started in 3333 port!');
});
