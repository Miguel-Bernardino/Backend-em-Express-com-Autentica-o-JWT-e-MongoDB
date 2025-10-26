import { Router } from 'express';
import * as taskController from '../controllers/taskController';
import {protectedMiddleware} from '../middleware/protectedMiddleware';

const router = Router();

router.use(protectedMiddleware);

//Criacao de tarefas
router.post('/tasks', taskController.CreateTask);

//Obter tarefas do usuario
router.get("/tasks", taskController.GetTasksByUserId);
router.get('/tasks/:id', taskController.GetTaskById);

//Atualizacao de tarefas
router.put('/tasks/:id', taskController.FullUpdateTask);
router.patch('/tasks/:id', taskController.PartialUpdateTask);

//Delecao e restauracao de tarefas
router.delete('/tasks/:id', taskController.DeleteTask);
router.patch('/tasks/:id/restore', taskController.restoreTask);

export default router;