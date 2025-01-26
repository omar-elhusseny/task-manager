require("dotenv").config()

// Import dependencies
const express = require("express");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo");

// Import local files 
const connectDB = require("./config/database");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./middlewares/errorHandling");
const mainRoutes = require("./routes/index.route");

// initialize the application
const app = express();

// Connect to the database
connectDB();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(require("cookie-parser")());
app.use(express.static(path.join(__dirname, "public")));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24, // 1 day
    }
}))

// Routes
mainRoutes(app);

// Unrecognized route
app.all("*", (req, res, next) => next(new AppError("Unrecognized url", 404)));

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