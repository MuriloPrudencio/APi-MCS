import { NextFunction, Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import userRepository from '../Repositories/user.repositories';

//Router permite  criar configurações de rotas

//get / users
// get / useres/:uuid
//post /users
//put /users/:uuid
//delete /users/:uuid

const usersRoute = Router();

/*Criamos esse End-Point Get, que irá buscar todos os usuários*/
usersRoute.get(
  '/users',
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await userRepository.findAllUsers();
    res.status(StatusCodes.OK).send({ users });
  },
);

/*Criamos esse End-Point que irá buscar um usuário especifico com a sua "uuid" */
usersRoute.get(
  '/users/:uuid',
  async (req: Request<{ uuid: string }>, res: Response, next: NextFunction) => {
    try {
      const uuid = req.params.uuid;
      const user = await userRepository.findById(uuid);
      res.status(StatusCodes.OK).send(user);
    } catch (error) {
      next(error);
    }
  },
);

/*Criamos esse End-Point "Post" para a criação de usuários*/
usersRoute.post(
  '/users',
  async (req: Request, res: Response, next: NextFunction) => {
    const newUser = req.body;
    const uuid = await userRepository.create(newUser);
    res.status(StatusCodes.CREATED).send(uuid);
  },
);

/*Criamos esse End-Poin "Put" que irá alterar um usuário */
usersRoute.put(
  '/users/:uuid',
  async (req: Request<{ uuid: string }>, res: Response, nex: NextFunction) => {
    const uuid = req.params.uuid;
    const modifiedUser = req.body;

    modifiedUser.uuid = uuid;

    await userRepository.update(modifiedUser);
    res.status(StatusCodes.OK).send();
  },
);

/*Criamos esse End-Point "Delete" para deletar um usuário */
usersRoute.delete(
  '/users/:uuid',
  async (req: Request, res: Response, nex: NextFunction) => {
    const uuid = req.params.uuid;
    await userRepository.remove(uuid);
    res.sendStatus(StatusCodes.OK);
  },
);

export default usersRoute;
