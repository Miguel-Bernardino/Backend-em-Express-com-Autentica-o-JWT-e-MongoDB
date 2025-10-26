import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

interface PersonError extends Error {
    status?: number;
    message: string;
}

export const errorHandler = (err: PersonError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.status || 500;
    const message = err.message || '❌ Erro interno do servidor';

    const { email } = req.body;

    // ETAPA 1: Validação de Formato Simples (Melhor usar um middleware dedicado)
    // Se o email não se parece com um email, você pode retornar 400 imediatamente.
    // Exemplo Simples:
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) && email) {
      // Retorna 400 Bad Request se o formato estiver errado
      return res.status(400).json({ 
        message: 'O formato do email fornecido é inválido.' 
      });
    }

    if (err instanceof mongoose.Error.ValidationError) {
        // Retorna 400 Bad Request

        return res.status(400).json({
            status: 'error',
            message: 'Falha na validação dos dados de entrada.',
        });
    }
    

    res.status(statusCode).json({
        message: message,
    });
};