import mongoose, { Schema, Document, Model } from 'mongoose';

export type UserRole = 'student' | 'teacher';

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    image?: string;
    role: UserRole;
}

const UserSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String },
        image: { type: String },
        role: { type: String, enum: ['student', 'teacher'], default: 'student', required: true },
    },
    { timestamps: true }
);

export const UserModel: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>('User', UserSchema);