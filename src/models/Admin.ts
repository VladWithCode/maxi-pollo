import mongoose, { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IAdmin extends mongoose.Document {
  name: string;
  pass: string;
  validatePass(pw: string): Promise<boolean>;
}

const AdminSchema = new Schema<IAdmin>({
  name: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  pass: {
    type: String,
    required: true,
  },
});

AdminSchema.pre('save', async function (next) {
  if (!this.isModified('pass')) return next();

  try {
    this.pass = await bcrypt.hash(this.pass, 10);
    next();
  } catch (err) {
    next(err);
  }
});

AdminSchema.methods['validatePass'] = async function (pw: string): Promise<boolean> {
  return await bcrypt.compare(pw, this.pass);
};

export default model<IAdmin>('Admin', AdminSchema);
