import { Router } from "express";
const router = Router();
import { getAllTasks, createTask, getTask, deleteTask, editTask } from '../controllers/tasks.controller.js';

// /api/v1/tasks
router.route('/').get(getAllTasks).post(createTask)
// /api/v1/tasks/:id
router.route('/:id').get(getTask).patch(editTask).delete(deleteTask)

export default router;