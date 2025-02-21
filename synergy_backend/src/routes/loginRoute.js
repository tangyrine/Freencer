import express from 'express';
import { login_user } from '../controllers/login.js';

const router = express.Router();

router.post('/login', login_user);

export default router;
