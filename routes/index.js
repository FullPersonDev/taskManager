//Routes Central Hub

const router = require('express').Router();

//Import routes
const tasksRouter = require('./tasks');
const completedTasksRouter = require('./completedTasks');

//Use routes
router.use('/tasks', tasksRouter);
router.use('/completedTasks', completedTasksRouter);

//Export router
module.exports = router