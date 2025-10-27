import {ITask, Task} from '../models/Task';
import { IUser, User } from '../models/User';

async function isUserExists(userId: any): Promise<any> {
    const user = await User.findOne({ _id: userId });
    return user;
}

async function isValidUser(taskId: any, userTokenedId: string): Promise<any> {
    
    const query = { _id: taskId };
    const task = await Task.findOne(query);
    
    if(!task){
        return { status: 404, message: 'Tarefa não encontrada.' };
    }
    
    const taskUser = await Task.findOne({ userId: task.userId });

    if(userTokenedId !== taskUser?.userId){
        return { status: 403, message: 'Acesso negado à tarefa.' };
    }

    const user = await User.findOne({ _id: userTokenedId });

    if(!user){
        return { status: 404, message: 'Usuário não encontrado.' };
    }

    return { status: 200, user};

}

export async function createTask(userID:string, { title,  description, userId}: { title: string, description: string, userId: string }): Promise<any> { 
    try {


        const usertokened = await isUserExists(userID);
        const user = await isUserExists(userId);
        
        if(!user || user.status >= 400 || !usertokened || usertokened.status >= 400){
            return { status: 403, message: 'Usuário inválido.' };
        }

        if(userID !== userId){
            return { status: 403, message: 'Não é permitido criar tarefa para outro usuário.' };
        }
        
        const newTask = await Task.create({ title, description, userId });
        
        return { status: 201, task: newTask };

    } catch (error) {
        
        return { status: 500, message: 'Erro ao criar a tarefa.' };
    
    }
}

export const getTasksByUserId = async (userId: string, filters: any): Promise<any> => {
    try {

        //const query = { user: userId };
        //const tasks = await Task.find(query);
        const tasks = await Task.find({ userId: userId, deleted: false, ...filters });

        if (!tasks || tasks.length === 0) {
            return { status: 404, message: 'Tarefas não encontradas.' };
        }

        const validUser = await isValidUser(tasks[0]?._id, userId);

        if(!validUser || validUser.status >= 400){
            return { status: 403, message: 'Usuário inválido.' };
        }

        return { status: 200, tasks };

    } catch (error) {
        
        return { status: 500, message: 'Erro ao buscar as tarefas.' };
    
    }
};

export const getTasksById = async (taskId: string, userId: string): Promise<any> => {
    try {

        const query = { _id: taskId };
        const task = await Task.findOne(query);
        
        if(!task){
            return { status: 404, message: 'Tarefa não encontrada.' };
        }

        const validUser = await isValidUser(task._id, userId);

        if(!validUser || validUser.status >= 400){
            return { status: 403, message: 'Usuário inválido.' };
        }

        return { status: 200, task };

    } catch (error) {
        
        return { status: 500, message: 'Erro ao buscar as tarefas.' };
    
    }
};

export const updateTask = async (taskId: string, userId: string, updateData: Partial<ITask>): Promise<any> => {

    try {

        const query = { _id: taskId };

        console.log('Querying task with ID:', taskId);
        console.log('Update data:', updateData);
        console.log('User ID:', userId);

        const task = await Task.findOne(query);
        
        console.log('Found task:', task);
        
        if(!task){
            return { status: 404, message: 'Tarefa não encontrada.' };
        }
        
        const validUser = await isValidUser(task._id, userId);

        if(!validUser || validUser.status >= 400){
            return { status: 403, message: 'Usuário inválido.' };
        }

        if(task.deleted || updateData.deleted !== undefined){
            return { status: 404, message: 'Tarefa não encontrada.' };
        }
        
        Object.assign(task, updateData);
        
        await task.save();
        
        return { status: 200, task };

    } catch (error) {
        return { status: 500, message: 'Erro ao atualizar a tarefa.' };
    }
}

export const deleteTask = async (taskId: string, userId: string): Promise<any> => {

    try {
        const query = { _id: taskId };
        const task = await Task.findOne(query); 

        if(!task){
            return { status: 404, message: 'Tarefa não encontrada.' };
        }   

        const validUser = await isValidUser(task._id, userId);

        if(!validUser || validUser.status >= 400){
            return { status: 403, message: 'Usuário inválido.' };
        }
        
        task.deleted = true;
        await task.save();

        return { status: 200, message: 'Tarefa deletada com sucesso.' };
    
    } catch (error) {
        return { status: 500, message: 'Erro ao deletar a tarefa.' };
    }

}

export const restoreTask = async (taskId: string, userId: string): Promise<any> => {

    try {
        const query = { _id: taskId };
        const task = await Task.findOne(query); 
        
        if(!task) {
            return { status: 404, message: 'Tarefa não encontrada.' };
        }

        const validUser = await isValidUser(task._id, userId);

        if(!validUser || validUser.status >= 400){
            return { status: 403, message: 'Usuário inválido.' };
        }

        if(!task.deleted){
            return { status: 400, message: 'A tarefa não está deletada.' };
        }

        task.deleted = false;
        await task.save();

        return { status: 200, message: 'Tarefa restaurada com sucesso.' };
    
    } catch (error) {
        return { status: 500, message: 'Erro ao restaurar a tarefa.' };
    }
}