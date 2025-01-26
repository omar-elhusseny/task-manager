const express = require("express");
const router = express.Router();

const { getAllTasks, createTask, getTask, deleteTask, editTask, editCategory } = require('../controllers/tasks.controller');
const { isAuthenticated } = require("../middlewares/isAuth");

// protect all task routes
router.use(isAuthenticated);

// /api/v1/tasks
router.route('/').get(getAllTasks).post(createTask)
// /api/v1/tasks/:id
router.route('/:id').get(getTask).patch(editTask).delete(deleteTask)

module.exports = router;