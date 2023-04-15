import { validationResult } from 'express-validator';
import { TypedRequestHandler } from '../@types/requests';

import User from '../models/User';
import Game from '../models/Game';

export const createLobby: TypedRequestHandler = async (req, res) => {
    try {
        if (!req.user) throw new Error('User not found');

        const user = await User.findById(req.user.id).select('-password');

        const game = await Game.create({
            players: [user],
        });

        res.json({
            data: game,
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
