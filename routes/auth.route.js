const express = require("express");
const router = express.Router();
const { register, login, logout } = require("../controllers/auth.controller");

// /api/v1/auth/register
router.post("/register", register);

// /api/v1/auth/login
router.post("/login", login);

module.exports = router;
