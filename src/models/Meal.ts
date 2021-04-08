import mongoose, { Schema, model } from 'mongoose';

export interface Meal extends mongoose.Document {
  name: string;
  price: number;
  category: string;
  thumb: string;
  description?: string;
  available: boolean;
}

const MealSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String, default: null },
  thumb: { type: String },
  available: { type: Boolean, default: true }
});

export default model<Meal>('Meal', MealSchema);
