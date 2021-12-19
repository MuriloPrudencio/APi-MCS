import { NextFunction, Request, Response } from "express";
import ForbiddenError from "../model/Errors/forbidden.error";
import userRepositories from "../Repositories/user.repositories";


async function basicAuthenticationMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const authorizationHeader = req.headers['authorization'];

        if (!authorizationHeader) {
            throw new ForbiddenError('Credenciais não informadas');
        }

        const [authenticationType, token] = authorizationHeader.split(' ');

        if (authenticationType !== 'Basic' || !token) {
            throw new ForbiddenError('Tipo de authenticação inválido');
        }

        const tokenContent = Buffer.from(token, 'base64').toString('utf-8');

        const [username, password] = tokenContent.split(':');

        if (!username || !password) {
            throw new ForbiddenError('Credenciais não preenchidas');
        }

        const user = await userRepositories.findByUsernameAndPassword(username, password);
        
        if (!user) {
            throw new ForbiddenError('Usuário ou senha inválidos!');
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
}

export default basicAuthenticationMiddleware;