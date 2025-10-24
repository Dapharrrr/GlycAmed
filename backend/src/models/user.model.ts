import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    name: string;
    firstname: string;
    email: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const UserSchema: Schema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        firstname: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true },
    },
    { timestamps: true }
);

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;
