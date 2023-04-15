import { model, ObjectId, Schema } from 'mongoose';

export interface RefreshTokenType {
    _id: ObjectId;
    token: string;
}

const RefreshTokenSchema = new Schema<RefreshTokenType>({
    token: {
        type: String,
        required: true,
    },
});

const RefreshToken = model('refreshToken', RefreshTokenSchema);

export default RefreshToken;
