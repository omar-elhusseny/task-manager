import { Router } from "express";
const router = Router();
import { register, login } from "../controllers/auth.controller.js";
import { loginValidation, registerValidation } from "../middlewares/validations/authValidation.js";

// /api/v1/auth/register
router.post("/register", registerValidation, register);

// /api/v1/auth/login
router.post("/login", loginValidation, login);

export default router;
