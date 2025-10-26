import { IUser, User } from '../models/User';
import bcrypt from 'bcryptjs';
import { sign, Secret, JwtPayload } from 'jsonwebtoken';

// --- Checagem de Chave Secreta JWT ---
const getJwtSecret = (): Secret => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        // Erro 500: Falha na configuração do servidor
        throw { status: 500 , message: 'Erro interno: Chave JWT não configurada.' }; 
    }
    return secret;
};

// --- Checagem das Credenciais ---
const checkCredentials = (userCredentials?: any): any => {
    const { email, password } = userCredentials || {};

    if (!userCredentials || typeof userCredentials !== 'object' || !email || !password) {
        return false;
    }

    return userCredentials;
};

export async function attemptToLogUser(userCredentials: IUser) : Promise<any> {
    
    
    const checkedCredentials: any = checkCredentials(userCredentials);

    const uncheckedUser = await User.findOne({ email: checkedCredentials.email }).select('+password');
    
    if (!uncheckedUser || !checkedCredentials) {
        return { status: 401, message: 'Email ou senha inválidos' };
    }
    
    const checkedUser = checkCredentials(uncheckedUser);

    const isMatch = await bcrypt.compare(checkedCredentials.password, checkedUser.password);

    if (!isMatch) {
        return { status: 401, message: 'Email ou senha inválidos' };
    }

    const token = sign({ id: checkedUser._id }, getJwtSecret(), { expiresIn: '1d' });

    return { 
        status: 200,
        token, 
        user: {
            id: checkedUser._id,
            name: checkedUser.name,
            email: checkedUser.email,
        } 
    };
}

export async function attemptToRegisterUser(userData: IUser) : Promise<any> {
    
    const checkedCredentials: any = checkCredentials(userData);


    if (!checkedCredentials || !checkedCredentials.name) {
        return { status: 400, message: 'Email, senha e nome são obrigatórios.' };
    }

    const existingUser = await User.findOne({ email: checkedCredentials.email });

    if (existingUser) {
        return { status: 409, message: 'Email já está em uso' };
    }

    
    if (checkedCredentials.password.length < 6) {
        return { status: 400, message: 'A senha deve ter pelo menos 6 caracteres.' };
    }

    //const hashedPassword = await bcrypt.hash(checkedCredentials.password, 10);

    const newUser = new User({ 
        name: checkedCredentials.name, 
        email: checkedCredentials.email, 
        password: checkedCredentials.password, 
    });

    await newUser.save();

    const token = sign({ id: newUser._id }, getJwtSecret() as string, { expiresIn: '1d' });

    return { 
        status: 200,
        token, 
        user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
        } 
    };
}
