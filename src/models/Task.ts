import { Schema, model, Document } from "mongoose"
import bcrypt from 'bcryptjs';

export interface ITask extends Document {
  title: string;
  description?: string;
  completed: boolean;
  userId: string;
  deleted: boolean; 
}

export const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, "Título é obrigatório"],
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    userId: {
      type: String,
      required: [true, "ID do usuário é obrigatório"]
    },
    deleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export const Task = model<ITask>('Task', taskSchema);

