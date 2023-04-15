import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '../config/envs';
import { TypedRequestHandler } from '../@types/requests';
import { UserType } from '../models/User';

export const authMiddleware: TypedRequestHandler = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    try {
        if (!token) throw new Error('No token provided');

        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        const user = decoded.user as UserType;
        if (!user) throw new Error('User with token not found');

        req.user = user;

        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({
            errors: [
                {
                    msg: 'Unauthorized',
                    errorCode: 'UNAUTHORIZED',
                },
            ],
        });
    }
};
