import dotenv from "dotenv"

// Import dependencies
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import Mongo from "connect-mongo";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";

// Import local files 
import connectDB from "./config/database.js";
import AppError from "./utils/appError.js";
import globalErrorHandler from "./middlewares/errorHandling.js";
import mainRoutes from "./routes/index.route.js";

dotenv.config();

// variables
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// initialize the application
const app = express();

// Connect to the database
connectDB();

const limiter = rateLimit({
    windowMS: 15 * 60 * 1000,
    max: 100,
    skip: (req) => req.ip === '127.0.0.1' 
})


// Middlewares
app.use(limiter)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: Mongo.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24, // 1 day
    }
}))

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
    console.log(`Mode: ${process.env.NODE_ENV}`);
}

// Routes
mainRoutes(app);

// Unrecognized route
app.all("*", (req, res, next) => next(new AppError(`Unrecognized URL: ${req.originalUrl}`, 404)));

// Global error handling middleware
app.use(globalErrorHandler);

// Start the server
const server = app.listen(process.env.PORT || 3000, () => { console.log(`Server is listening on port: ${process.env.PORT}`) });

// any error catched outside express error-middleware
process.on("unhandledRejection", (error) => {
    console.log(`unhandledRejection Error: ${error.name} | ${error.message}`);
    console.log(error)
    server.close(_ => {
        console.log("Server is OFF");
        process.exit(1);
    })
})