import asyncWrapper from '../middlewares/asyncWrapper.js';
import Task from '../models/task.model.js';
import QueryHelper from '../utils/queryHelper.js';

export async function getAllTasks(req, res) {
    const queryHelper = new QueryHelper(Task.find({ owner: req.session.userId }), req.query)
        .filter()
        .sort()
        .search()
        .selectFields();

    const tasks = await queryHelper.query;
    res.status(200).json({ tasks })
}

export const createTask = asyncWrapper(async (req, res) => {
    const task = await Task.create({ ...req.body, owner: req.session.userId });
    res.status(201).json({ message: "Task created.", task })
});

export async function getTask(req, res) {
    const task = await Task.findById(req.params.id);
    if(!task) return res.status(404).json({message: "Task not found."})
    res.status(201).json({ task })
}

export async function editTask(req, res) {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(201).json({ task });
}

export async function deleteTask(req, res) {
    const task = await Task.findByIdAndDelete(req.params.id);
    res.status(201).json({ task });
}