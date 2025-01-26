const mongoose = require('mongoose');
const asyncWrapper = require('../middlewares/asyncWrapper');

const connectDB = asyncWrapper(async () => {
    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${connect.connection.host}`);
});

module.exports = connectDB;