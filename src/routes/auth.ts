import express from 'express';
import { authMiddleware } from '../middleware/auth';
import { body, header } from 'express-validator';
import {
    getUser,
    loginUser,
    registerUser,
    refreshToken,
} from '../controller/auth';

import User from '../models/User';
import { PASSWORD_REGEX } from '../shared/regexs';

const router = express.Router();

// @route   GET api/auth
// @desc    Get login user
// @access  Private
router.get('/', authMiddleware, getUser);

// @route   POST api/auth/register
// @desc    Register User
// @access  Public
router.post(
    '/register',
    [
        body('email')
            .trim()
            .isEmail()
            .normalizeEmail()
            .withMessage('Wprowadź poprawny email.')
            .custom(async (value) => {
                const user = await User.findOne({ email: value }).select('id');
                if (user)
                    return Promise.reject('Podany email jest już zajęty.');
            }),
        body('nick')
            .trim()
            .isString()
            .custom(async (value) => {
                const user = await User.findOne({ nick: value }).select('id');
                if (user)
                    return Promise.reject('Nazwa użytkownika jest już zajęta.');
            }),
        body(
            'password',
            'Hasło musi zawierać minimum 8 znaków, conajmniej 1 literę oraz cyfrę.',
        )
            .isString()
            .matches(PASSWORD_REGEX),
    ],
    registerUser,
);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
    '/login',
    [
        body('email', 'Wprowadź email.').trim().isEmail(),
        body('password', 'Wprowadź hasło.').isString(),
    ],
    loginUser,
);

// @route   GET api/auth/refresh
// @desc    refresh user token
// @access  Public
router.get(
    '/refresh',
    [header('Refresh-Token', 'Brak tokenu.').isString()],
    refreshToken,
);

export default router;
