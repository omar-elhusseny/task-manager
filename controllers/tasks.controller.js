const asyncWrapper = require('../middlewares/asyncWrapper');
const Task = require('../models/task.model');
const QueryHelper = require('../utils/queryHelper');

exports.getAllTasks = async (req, res) => {
    console.log(req.query)
    const queryHelper = new QueryHelper(Task.find({ owner: req.session.userId }), req.query)
        .filter()
        .sort()
        .search()
        .selectFields();

    const tasks = await queryHelper.query;
    res.status(200).json({ tasks })
};

exports.createTask = asyncWrapper(async (req, res) => {
    const task = await Task.create({ ...req.body, owner: req.session.userId });
    res.status(201).json({ message: "Task created.", task })
});

exports.getTask = async (req, res) => {
    const task = await Task.findById(req.params.id);
    res.status(201).json({ task })
};

exports.editTask = async (req, res) => {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(201).json({ task });
}

exports.deleteTask = async (req, res) => {
    const task = await Task.findByIdAndDelete(req.params.id);
    res.status(201).json({ task });
};