const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    status: {
        type: String,
        enum: ["Pending", "In Progress", "Completed"],
        default: "Pending"
    },
    dueDate: Date,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    priority: {
        type: Number,
        min: [1, 'Min priority value is 1'],
        max: [5, 'Max priority value is 5']
    },
    categories: [{
        type: String,
        trim: true, // optional: removes extra spaces around category names
    }],
}, { timestamps: true });

module.exports = mongoose.model("Task", TaskSchema);
