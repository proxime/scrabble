import { model, ObjectId, Schema } from 'mongoose';
import { UserType } from './User';

export type GameStatusType = 'lobby' | 'running' | 'finished';

export interface GameType {
    id: ObjectId;
    players?: {
        player: UserType;
        ready: boolean;
    }[];
    createdAt: Date;
    status: GameStatusType;
    creatorId: ObjectId;
}

const GameSchema = new Schema<GameType>({
    players: [
        {
            player: { type: Schema.Types.ObjectId, ref: 'user' },
            ready: {
                type: Boolean,
                default: false,
            },
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        default: 'lobby',
    },
    creatorId: { type: Schema.Types.ObjectId },
});

const Game = model('game', GameSchema);

export default Game;
