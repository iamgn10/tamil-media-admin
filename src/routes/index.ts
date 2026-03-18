import { Router } from 'express';
import { getV1Routes } from './v1/v1';

const router = Router();
const v1Router = Router();

getV1Routes(v1Router); // All versioned routes are added to v1Router

router.use("/api/v1", v1Router); // Now /auth becomes /api/v1/auth

export default router;
