const express = require("express");
const router = express.Router();
const { logout, getProfile, updataUser, updatePassword } = require("../controllers/user.controller");

// /api/v1/users
router.route("/").get(getProfile).put(updataUser);

// /api/v1/users/logout
router.post("/logout", logout);

// /api/v1/users/password
router.put("/password", updatePassword);

module.exports = router;
