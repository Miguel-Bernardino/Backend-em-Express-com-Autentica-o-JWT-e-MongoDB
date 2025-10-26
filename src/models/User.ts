import { Schema, model, Document } from "mongoose"
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name?: string;
  email?: string;
  password?: string;
}

const userSchema = new Schema<IUser>(
  {
    name:     { 
      type: String, 
      required: [true, "Nome é obrigatório" ], 
      trim: true,                                
    },
    email:    { 
      type: String, required: [true, "Email é obrigatório"], 
      trim: true, 
      unique: true, 
      lowercase: true, 
      match: [/.+\@.+\..+/, 'Por favor, insira um email válido.'],
    },
    password: { 
      type: String, 
      required: [true, "Senha é obrigatório"], 
      trim: true, 
      select: false,                 
    },

  },
  { timestamps: true }
);

userSchema.pre('save', async function(next) {

  // realiza o hash se a senha foi modificada ou se possui campos obrigatórios preenchidos
  if (!this.isModified('password') || !this.name || 
  !this.email || !this.password ) return next(); 

  try {

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  
    next();

  }catch(err: any) {
    next(err);
  }

});

export const User = model<IUser>('User', userSchema);