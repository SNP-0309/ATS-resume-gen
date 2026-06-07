import express from 'express';
import {login, register,logout,getUser} from '../controllers/auth.controllers.js';


const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/user', getUser);




export default router;