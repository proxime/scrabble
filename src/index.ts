import dotenv from 'dotenv';
dotenv.config();

import express, { Express } from 'express';
import bodyParser from 'body-parser';
import boot from './boot';

import authRoutes from './routes/auth';
import gameRoutes from './routes/game';

const app: Express = express();

app.use(bodyParser.json());
app.use(express.json({}));

app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);

boot(app);
