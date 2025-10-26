import {     Request, Response, NextFunction     } from 'express';
import { attemptToLogUser, attemptToRegisterUser } from '../services/UserService';


export const LogUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const user = await attemptToLogUser(req.body);

        if (user.status === 200) {
            res.status(200).json({ message: 'Usuário logado com sucesso!', user });
        } else {
            res.status(user.status).json({ message: user.message });
        }

    } catch (error) {
        next(error);
    }

};

export const RegisterUser = async (req: Request, res: Response, next: NextFunction) => {
  
    try {

        const user = await attemptToRegisterUser(req.body);
        if (user.status === 200) {
            res.status(200).json({ message: 'Usuário Criado com sucesso!', user });
        } else {
            res.status(user.status).json({ message: user.message });
        }

    } catch (error) {
        next(error);
    }

};