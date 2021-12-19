import { NextFunction, Request, Response } from 'express';
import JWT from 'jsonwebtoken';
import ForbiddenError from '../model/Errors/forbidden.error';
import userRepositories from '../Repositories/user.repositories';

async function bearerAuthenticationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authorizationHeader = req.headers['authorization'];

    if (!authorizationHeader) {
      throw new ForbiddenError('Credenciais não informadas');
    }

    const [authenticationType, token] = authorizationHeader.split(' ');

    if (authenticationType !== 'Bearer' || !token) {
      throw new ForbiddenError('Tipo de autenticação inválida');
    }

    const tokenPayload = JWT.verify(token, 'my_secret_key');

    if (typeof tokenPayload !== 'object' || !tokenPayload.sub) {
      throw new ForbiddenError('Token inválido');
    }

    const uuid = tokenPayload.sub;
    const user = await userRepositories.findById(uuid);
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

export default bearerAuthenticationMiddleware;
