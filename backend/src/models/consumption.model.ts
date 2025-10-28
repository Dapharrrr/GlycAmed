import mongoose, { Document, Schema } from 'mongoose';
import type { IUser } from './user.model.js';

export interface IConsumption extends Document {
    user: IUser['_id'];
    barcode?: string;
    productName?: string;
    quantity?: number;
    date: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

const ConsumptionSchema: Schema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        barcode: { type: String, trim: true },
        productName: { type: String, trim: true },
        quantity: { type: Number, default: 1, min: 1 },
        date: { type: Date, default: () => new Date() },
    },
    { timestamps: true }
);

// Ensure at least one of barcode or productName is provided
ConsumptionSchema.pre('validate', function (next) {
    // `this` is the document
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const doc: any = this;
    if (!doc.barcode && !doc.productName) {
        next(new Error('Either barcode or productName must be provided'));
    } else {
        next();
    }
});

const Consumption = mongoose.models.Consumption || mongoose.model<IConsumption>('Consumption', ConsumptionSchema);
export default Consumption;
