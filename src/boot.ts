import express, { Express, Response } from 'express';
import { connectDB } from './config/db';
import { NODE_ENV, PORT } from './config/envs';
import path from 'path';
import http from 'http';
import { loadWords } from './utils/loadWords';

const port = PORT || 5000;

const boot = (app: Express) => {
    connectDB();
    loadWords();

    const server = http.createServer(app);

    if (NODE_ENV === 'production') {
        app.use(express.static('client/build'));

        app.get('*', (_, res: Response) => {
            res.sendFile(
                path.resolve(__dirname, 'client', 'build', 'index.html'),
            );
        });
    }

    server.listen(port, () => console.log(`Server running at port ${port}`));
};

export default boot;
