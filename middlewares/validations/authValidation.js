import { body, check } from "express-validator";
import User from "../../models/user.model.js";
import AppError from "../../utils/appError.js";
import validation from "../validation.js";

export const loginValidation = [
    body("email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Please enter a valid email form"),
    body("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 8 }).withMessage("Minimum length is 8 characters")
        .custom(async (val, { req }) => {
            const user = await User.findOne({ email: req.body.email });
            if (!user) return Promise.reject(new AppError("No user found", 404));
            if (!(await user.comparePassword(val))) return Promise.reject(new AppError("Wrong password", 400));
        }),
    validation
]

export const registerValidation = [
    body("name")
        .notEmpty().withMessage("Name is required"),
    body("email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Please enter a valid email form")
        .custom(async(val, { req }) => {
            const user = await User.findOne({ email: val });
            if (user) return Promise.reject(new AppError("Invalid email or password", 400));
        }),
    body("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 8 }).withMessage("Minimum length is 8 characters"),
    validation
]