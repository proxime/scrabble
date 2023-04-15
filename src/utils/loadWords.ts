import Word, { WordType } from '../models/Word';
import fs from 'fs';
import path from 'path';

const BATCH_SIZE = 10_000;

const batchInsert = async (records: Omit<WordType, '_id'>[]) => {
    for (let i = 0; i < records.length; i += BATCH_SIZE) {
        const batch = records.slice(i, i + BATCH_SIZE);
        await Word.insertMany(batch);
        console.log(`Words ${batch.length + i} / ${records.length} inserted`);
    }
};

export const loadWords = async () => {
    const wordsFile = fs
        .readFileSync(
            path.resolve(__dirname, '..', 'shared', 'words.txt'),
            'utf8',
        )
        .toString()
        .split('\r\n')
        .filter((word) => word)
        .map((word) => ({ value: word }));

    try {
        const wordsCount = await Word.count();
        if (wordsCount === wordsFile.length) return;

        console.log('Deleting outdated words...');
        await Word.deleteMany({});

        console.log('Upload new words...');
        await batchInsert(wordsFile);

        console.log('Words loaded successfully');
    } catch (err) {
        console.log('Error while loading words');
        console.error(err);
    }
};
