import express from 'express';

import UserController from '../controllers/user.controller';
import {
  signInValidator,
  signUpValidator,
} from '../middleware/validator.middleware';
import { checkAuth } from '../utils/auth.util';

const router = express.Router();

router.post('/signup', signUpValidator, UserController.signUp);
router.post('/signin', signInValidator, UserController.signIn);
router.get('/', checkAuth, UserController.getUsers);
router.get('/profile', checkAuth, UserController.getProfile);
router.put('/profile', checkAuth, UserController.updateProfile);

export default router;
