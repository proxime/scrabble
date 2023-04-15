import { model, ObjectId, Schema } from 'mongoose';
import { UserType } from './User';

export type GameStatusType = 'lobby' | 'running' | 'finished';

export interface GameType {
    id: ObjectId;
    players?: UserType[];
    createdAt: Date;
    status: GameStatusType;
}

const GameSchema = new Schema<GameType>({
    players: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        default: 'lobby',
    },
});

const Game = model('game', GameSchema);

export default Game;
