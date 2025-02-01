import { Router } from "express";
const router = Router();
import { logout, getProfile, updataUser, updatePassword } from "../controllers/user.controller.js";

// /api/v1/users
router.route("/").get(getProfile).put(updataUser);

// /api/v1/users/logout
router.post("/logout", logout);

// /api/v1/users/password
router.put("/password", updatePassword);

export default router;
