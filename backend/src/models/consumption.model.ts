import mongoose, { Document, Schema } from 'mongoose';
import type { IUser } from './user.model.js';

export interface IConsumption extends Document {
    user: IUser['_id'];
    contributor: IUser['_id']; // Who added this consumption
    barcode?: string;
    productName: string;
    brand?: string;
    imageUrl?: string;
    quantity: number; // in grams
    location?: string;
    notes?: string;
    nutrients: {
        sugars: number; // calculated for the consumed quantity
        caffeine: number; // calculated for the consumed quantity
        calories: number; // calculated for the consumed quantity
    };
    date: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

const ConsumptionSchema: Schema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        contributor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        barcode: { type: String, trim: true },
        productName: { type: String, trim: true, required: true },
        brand: { type: String, trim: true },
        imageUrl: { type: String, trim: true },
        quantity: { type: Number, required: true, min: 0.1 },
        location: { type: String, trim: true },
        notes: { type: String, trim: true },
        nutrients: {
            sugars: { type: Number, default: 0, min: 0 },
            caffeine: { type: Number, default: 0, min: 0 },
            calories: { type: Number, default: 0, min: 0 },
        },
        date: { type: Date, default: () => new Date() },
    },
    { timestamps: true }
);

// ProductName is now required, so no need for this validation

const Consumption = mongoose.model<IConsumption>('Consumption', ConsumptionSchema);
export default Consumption;
