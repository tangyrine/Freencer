import express from 'express';
import { create_user } from '../controllers/create_user.js'; 

const router = express.Router();

router.post('/create-user', create_user);

export default router;
