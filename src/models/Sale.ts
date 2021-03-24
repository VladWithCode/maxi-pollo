import mongoose, { Schema, model, Types } from 'mongoose';

export interface ISaleItem {
  title: string;
  qty: number;
  price: number;
  total: number;
  sauce?: string;
}

export interface ISale extends mongoose.Document {
  customer: {
    name: string;
    phone: string;
  };
  address: {
    street: string;
    nbHood: string;
    extNumber: number;
    intNumber?: string;
    postalCode: number;
    refs?: string;
  };
  content: {
    items: ISaleItem[];
  };
  state?: 'initialized' | 'confirmed' | 'payed' | 'delivered';
  createdAt?: number;
  confirmedAt?: number;
  paymentMethod?: string;
  payed?: boolean;
  payedAt?: number;
  subtotal: number;
  tax?: number;
  deliveryFee?: number;
  total: number;
}

const SaleSchema = new Schema({
  customer: {
    name: String,
    phone: String,
  },
  address: {
    street: String,
    nbHood: String,
    extNumber: Number,
    intNumber: String,
    postalCode: Number,
    refs: String,
  },
  content: {
    items: [
      {
        title: String,
        qty: Number,
        price: Number,
        total: Number,
        sauce: String,
      },
    ],
  },
  state: {
    type: String,
    default: 'initialized',
    enum: ['initialized', 'confirmed', 'payed', 'delivered'],
  },
  paymentMethod: { type: String, default: 'Efectivo' },
  createdAt: { type: Number, default: Date.now() },
  confirmedAt: { type: Number },
  payed: { type: Boolean, default: false },
  payedAt: Number,
  delivered: { type: Boolean, default: false },
  subtotal: { type: Number },
  deliveryFee: { type: Number },
  tax: { type: Number },
  total: { type: Number },
});

export default model<ISale>('Sale', SaleSchema);
