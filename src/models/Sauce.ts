import mongoose, { Schema, model } from 'mongoose';

export interface ISauce extends mongoose.Document {
  name: string;
  available: boolean;
}

const SauceSchema = new Schema({
  name: { type: String, required: true },
  available: { type: Boolean, default: true },
});

export default model<ISauce>('Sauce', SauceSchema);
