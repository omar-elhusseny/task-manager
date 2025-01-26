const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const asyncWrapper = require("../middlewares/asyncWrapper");
const AppError = require("../utils/appError");

// Logout a user
exports.logout = asyncWrapper(async (req, res, next) => {
    await req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: "Could not log out.", error: err });
        }
        res.clearCookie("connect.sid");
        return res.status(200).json({ message: "Logout successful." });
    });
});

// get user profile
exports.getProfile = asyncWrapper(async (req, res, next) => {
    if (!req.session.userId) return next(new AppError("No user found, login or signup please", 404));

    // Get the user from the token
    const user = await User.findById(req.session.userId);

    // Respond with success
    return res.status(200).json({ message: "User profile retrieved successfully", data: user });
})

// update user information
exports.updataUser = asyncWrapper(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.session.userId, req.body, { new: true });
    res.status(201).json({ message: "updated successfuly", data: user });
});

// update user password
exports.updatePassword = asyncWrapper(async (req, res, next) => {
    const { oldPassowrd, newPassword } = req.body;
    const user = await User.findByIdAndUpdate(
        req.session.userId,
        { password: await bcrypt.hash(newPassword, 10), passwordChangedAt: Date.now() },
        { new: true }
    );
    return res.status(200).json({ message: "Password changed" });
});