import { Router } from 'express';
import { register, login, refresh, logout } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { z } from 'zod';

const router = Router();

// Validation Schemas
const registerSchema = z.object({
  body: z.object({
    phone: z.string().min(11),
    password: z.string().min(6),
    name_bn: z.string().min(2),
    name_en: z.string().min(2)
  })
});

const loginSchema = z.object({
  body: z.object({
    phone: z.string().min(11),
    password: z.string().min(6),
    otp: z.string().optional()
  })
});

// Routes
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);

export default router;
