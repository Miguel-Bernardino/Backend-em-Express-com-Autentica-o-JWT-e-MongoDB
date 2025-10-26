import {     Request, Response, NextFunction     } from 'express';
import * as taskService from '../services/taskServices';

export const CreateTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const userId = req.user!.id;
        
        if (!userId) {
            return res.status(400).json({ message: 'ID do usuário é obrigatório.' });
        }
        
        const taskData = req.body;

        const result = await taskService.createTask(userId, { ...taskData });
        res.status(result.status).json(result);
        

    } catch (error) {
        next(error);
    }
};

export const GetTasksByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;

        if (!userId) {
            return res.status(400).json({ message: 'ID do usuário é obrigatório.' });
        }

        const filters = req.query;

        const result = await taskService.getTasksByUserId(userId, filters);
        
        res.status(result.status).json(result);
    } catch (error) {
        next(error);
    }
};  

export const GetTaskById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const taskId = req.params.id;
        const userId = req.user!.id;

        console.log('UserId from token:', userId);
        console.log('TaskId from params:', taskId);

        if (!userId || !taskId) {
            return res.status(400).json({ message: 'ID do usuário e ID da tarefa são obrigatórios ou estão inválidos.' });
        }

        const result = await taskService.getTasksById(taskId, userId);
        res.status(result.status).json(result);
    }
    catch (error) {
        next(error);
    }
};

export const FullUpdateTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const taskId = req.params.id;
        const userId = req.user!.id;
        
        if (!userId || !taskId) {
            return res.status(400).json({ message: 'ID do usuário e ID da tarefa são obrigatórios.' });
        }
        
        const updateData = req.body;
        
        if(updateData.userId && updateData.userId !== userId){
            return res.status(403).json({ message: 'Não é permitido alterar o ID do usuário da tarefa.' });
        }

        if(updateData.title === undefined || 
            updateData.description === undefined || 
            updateData.completed === undefined){
                return  res.status(400).json({ message: 'Todos os campos (title, description, completed) são obrigatórios para atualização completa.' });
                
        }
            
        const result = await taskService.updateTask(taskId, userId, updateData);        
        res.status(result.status).json(result);
    
    } catch (error) {
        next(error);
    }
};

export const PartialUpdateTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const taskId = req.params.id;
        const userId = req.user!.id;
        
        if (!userId || !taskId) {
            return res.status(400).json({ message: 'ID do usuário e ID da tarefa são obrigatórios.' });
        
        }
        
        const updateData = req.body;

        if(updateData.title === undefined && 
            updateData.description === undefined && 
            updateData.completed === undefined ){
                return  res.status(400).json({ message: 'Todos os campos (title, description, completed) são obrigatórios para atualização parcial.' });

        }

        const result = await taskService.updateTask(taskId, userId, updateData);
        
        res.status(result.status).json(result);
    
    } catch (error) {
        next(error);
    }

};

export const DeleteTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const taskId = req.params.id;
        const userId = req.user!.id;
        
        if (!userId || !taskId) {
            return res.status(400).json({ message: 'ID do usuário e ID da tarefa são obrigatórios.' });
        }

        const result = await taskService.deleteTask(taskId, userId);
        res.status(result.status).json(result);
    
    } catch (error) {
        next(error);
    }
};

export const restoreTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const taskId = req.params.id;  
        const userId = req.user!.id;

        if (!userId || !taskId) {
            return res.status(400).json({ message: 'ID do usuário e ID da tarefa são obrigatórios.' });
        }
        
        const result = await taskService.restoreTask(taskId, userId);
        res.status(result.status).json(result);
    
    } catch (error) {
        next(error);
    }
};
