import express from 'express';
import {login, register, logout, getUser} from '../controllers/auth.controllers.js';
import { authUser } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', authUser, logout);
router.get('/user', authUser, getUser);

export default router;