import express from 'express';
import { authMiddleware } from '../middleware/auth';
import { body, header } from 'express-validator';
import { createLobby } from '../controller/game';

import User from '../models/User';

const router = express.Router();

// @route   POST api/game/create
// @desc    create game lobby
// @access  Private
router.post('/create', authMiddleware, createLobby);

export default router;
