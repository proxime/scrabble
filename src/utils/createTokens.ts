import jwt from 'jsonwebtoken';
import { JWT_SECRET, REFRESH_TOKEN_SECRET } from '../config/envs';
import { UserType } from '../models/User';

import RefreshToken from '../models/RefreshToken';

export const createTokens = async (user: UserType) => {
    const payload = {
        user: {
            id: user.id,
        },
    };

    const tokens = await Promise.all([
        jwt.sign(payload, JWT_SECRET, { expiresIn: 3600 }),
        jwt.sign(payload, REFRESH_TOKEN_SECRET, {
            expiresIn: 1209600,
        }),
    ]);

    RefreshToken.create({
        token: tokens[1],
    });

    return tokens;
};
