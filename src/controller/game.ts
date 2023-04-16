import { TypedRequestHandler } from '../@types/requests';

import User from '../models/User';
import Game from '../models/Game';

export const createLobby: TypedRequestHandler = async (req, res) => {
    try {
        if (!req.user) throw new Error('User not found');

        const user = await User.findById(req.user.id).select('_id nick avatar');

        const game = await Game.create({
            players: [
                {
                    player: user,
                    ready: true,
                },
            ],
            creatorId: user?._id,
        });

        res.json({
            data: game,
        });
    } catch (err) {
        console.log(err);
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
