const asyncWrapper = require("../middlewares/asyncWrapper");
const User = require("../models/user.model");
const sendEmail = require("../config/mail");
const AppError = require("../utils/appError");

// Register a new user
exports.register = asyncWrapper(async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).send("All fields are required.");

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).send("User already exists.");

    const user = new User({ name, email, password });
    await user.save();

    req.session.userId = user._id; // Set session
    res.status(201).send("User registered successfully.");
});

// Login a user
exports.login = asyncWrapper(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send("All fields are required.");
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
        return res.status(400).send("Invalid email or password.");
    }
    req.session.userId = user._id; // Set session
    res.status(200).send("Login successful.");
});


exports.forgetPassword = asyncWrapper(async (req, res, next) => {

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

exports.verifyResetCode = asyncWrapper(async (req, res, next) => {
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

exports.resetPassword = asyncWrapper(async (req, res, next) => {
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