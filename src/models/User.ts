import { model, ObjectId, Schema } from 'mongoose';

export interface UserType {
    id: ObjectId;
    avatar?: string;
    createdAt: Date;
    email: string;
    password: string;
    nick: string;
}

const UserSchema = new Schema<UserType>({
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    avatar: {
        type: String,
    },
    nick: {
        type: String,
        required: true,
        unique: true,
    },
});

const User = model('user', UserSchema);

export default User;
