// src/index.ts
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { connectDB } from "./database/connect"; // ← Função de conexão
import userRoutes from './routes/userRoute';
import { errorHandler } from './middleware/errorMiddlleware';
import protectedRoute from "./routes/protectedRoute";
import taskRoutes from "./routes/taskRoutes";

const app = express();

dotenv.config(); // ← Carrega as variáveis do .env

// Middlewares globais
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.use('/api', userRoutes);
app.use('/api', protectedRoute);
app.use('/api', taskRoutes);

// Middleware de tratamento de erros
app.use(errorHandler);

// Inicializa o servidor Express
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});
