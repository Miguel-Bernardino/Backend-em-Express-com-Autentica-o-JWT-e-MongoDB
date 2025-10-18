// src/index.ts
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { connectDB } from "./database/connect"; // ← Função de conexão
import userRoutes from './routes/userRoute';
import { errorHandler } from './middleware/errorMiddlleware';
import protectedRoute from "./routes/protectedRoute";

const app = express();

dotenv.config(); // ← Carrega as variáveis do .env

// Middlewares globais
app.use(express.json());

// Conectar ao banco MongoDB Atlas
connectDB();

// Porta definida no .env ou 3000 por padrão
const PORT = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  
  res.status(200).json({ 

    message: '🚀 Projeto Backend em Express com Autenticação JWT e MongoDB funcionando!',
    status: 'WORKING',
  
  });

});

// Rotas
app.use('/', userRoutes);
app.use('/', protectedRoute);

// Middleware de tratamento de erros
app.use(errorHandler);

// Inicializa o servidor Express
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});
