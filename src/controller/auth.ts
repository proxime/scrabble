import { validationResult } from 'express-validator';
import { TypedRequestHandler } from '../@types/requests';
import bcrypt from 'bcrypt';
import { createTokens } from '../utils/createTokens';
import jwt, { JwtPayload } from 'jsonwebtoken';

import User, { UserType } from '../models/User';
import { REFRESH_TOKEN_SECRET } from '../config/envs';
import RefreshToken from '../models/RefreshToken';

export const getUser: TypedRequestHandler = async (req, res) => {
    try {
        if (!req.user) throw new Error('User not found');

        const user = await User.findById(req.user.id).select('-password');

        if (!user)
            return res.status(401).json({
                errors: [
                    {
                        msg: 'Unauthorized',
                        errorCode: 'UNAUTHORIZED',
                    },
                ],
            });

        res.json({
            data: user,
        });
    } catch (err) {
        res.status(500).json({
            errors: [
                {
                    msg: 'Internal server error.',
                    errorCode: 'INTERNAL_SERVER_ERROR',
                },
            ],
        });
    }
};

export const registerUser: TypedRequestHandler<{
    email: string;
    password: string;
    nick: string;
}> = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

    const { email, password, nick } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({
            email,
            nick,
            password: hashedPassword,
        });

        const tokens = await createTokens(user);
        return res.json({
            data: {
                token: tokens[0],
                refreshToken: tokens[1],
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            errors: [
                {
                    msg: 'Internal server error.',
                    errorCode: 'INTERNAL_SERVER_ERROR',
                },
            ],
        });
    }
};

export const loginUser: TypedRequestHandler<{
    email: string;
    password: string;
}> = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user)
            return res.status(401).json({
                errors: [
                    {
                        msg: 'Wprowadzono niepoprawne dane.',
                        errorCode: 'BAD_USER_INPUT',
                    },
                ],
            });

        const isMath = await bcrypt.compare(password, user.password);

        if (!isMath)
            return res.status(401).json({
                errors: [
                    {
                        msg: 'Wprowadzono niepoprawne dane.',
                        errorCode: 'BAD_USER_INPUT',
                    },
                ],
            });

        const tokens = await createTokens(user);
        return res.json({
            data: {
                token: tokens[0],
                refreshToken: tokens[1],
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            errors: [
                {
                    msg: 'Internal server error.',
                    errorCode: 'INTERNAL_SERVER_ERROR',
                },
            ],
        });
    }
};

export const refreshToken: TypedRequestHandler = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

    const token = req.header('Refresh-Token')?.replace('Bearer ', '');
    if (!token)
        return res.status(401).json({
            errors: [
                {
                    msg: 'Unauthorized',
                    errorCode: 'UNAUTHORIZED',
                },
            ],
        });

    try {
        const foundToken = await RefreshToken.findOne({ token }).select('_id');

        if (!foundToken)
            return res.status(401).json({
                errors: [
                    {
                        msg: 'Unauthorized',
                        errorCode: 'UNAUTHORIZED',
                    },
                ],
            });

        const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET) as JwtPayload;
        const user: UserType = decoded.user;

        const tokens = await createTokens(user);
        await RefreshToken.deleteOne({ _id: foundToken._id });

        return res.json({
            data: {
                token: tokens[0],
                refreshToken: tokens[1],
            },
        });
    } catch (err) {
        console.error(err);
        return res.status(401).json({
            errors: [
                {
                    msg: 'Unauthorized',
                    errorCode: 'UNAUTHORIZED',
                },
            ],
        });
    }
};
