import asyncWrapper from "../middlewares/asyncWrapper.js";
import User from "../models/user.model.js";
import sendEmail from "../config/mail.js";
import AppError from "../utils/appError.js";
import crypto from "crypto";
import bcrypt from "bcrypt";

export const register = asyncWrapper(async (req, res) => {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).send("User already exists.");

    const user = new User({ name, email, password });
    await user.save();

    req.session.userId = user._id; // Set session
    res.status(201).send("User registered successfully.");
});

export const login = asyncWrapper(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    req.session.userId = user._id; // Set session
    res.status(200).send("Login successful.");
});

export const forgetPassword = asyncWrapper(async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(new AppError("No user with this email"));

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedResetCode = crypto.createHash('sha256').update(resetCode).digest('hex');

    const message = `Hi ${user.username},\nWe received a request to reset the password.\nYour request code: ${resetCode}. \n Thanks for helping us keep your account secure.`;
    sendEmail(user.email, "Your password reset code (valid for 10 mins)", message);

    user.passwordResetCode = resetCode;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000 // in 10 mins
    user.passwordResetVerified = false;

    // Log reset code for testing
    console.log(`Reset code: ${resetCode} sent to ${user.email}`);

    await user.save();
    return res.status(200).json({ message: 'Reset code sent to your email, Check it out.' });
})

export const verifyResetCode = asyncWrapper(async (req, res, next) => {
    const { resetCode } = req.body;

    const hashedResetCode = crypto.createHash('sha256').update(resetCode).digest('hex');

    // 1) get the user based on the reset code
    const user = await User.findOne({ passwordResetCode: hashedResetCode, passwordResetExpires: { $gt: Date.now() } });
    if (!user) return next(new AppError('Reset code invalid or expired'));

    // 2) Reset code valid
    user.passwordResetVerified = true;

    await user.save();
    return res.status(200).json({ status: "user verified" });
})

export const resetPassword = asyncWrapper(async (req, res, next) => {
    // 1) Get user based on email
    const user = await User.findOne({ email: req.body.email });

    if (!user) return next(new AppError(`There is no user with email ${req.body.email}`, 404))

    // 2) Check if reset code verified
    if (!user.passwordResetVerified) return next(new AppError('Reset code not verified', 400));

    const hashedPassword = await bcrypt.hash(req.body.newPassword, 15);

    user.password = hashedPassword;
    user.passwordResetCode = null;
    user.passwordResetExpires = null;
    user.passwordResetVerified = null;

    await user.save();
    return res.status(201).json({ message: "password changed successfuly" });
})