import { model, ObjectId, Schema } from 'mongoose';

export interface WordType {
    _id: ObjectId;
    value: string;
}

const WordSchema = new Schema<WordType>({
    value: {
        type: String,
        required: true,
        unique: true,
    },
});

const Word = model('word', WordSchema);

export default Word;
