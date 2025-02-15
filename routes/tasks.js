//Import router and dependencies
const tasksR = require('express').Router();
const fs = require('fs');
const { promiseHooks } = require('v8');

//GET tasks
tasksR.get('/', (req, res) => {
    //read from database file
    fs.readFile('./db/tasks.json', (err, data) => {
        if(err) {console.error(err)};
        //make in memory array of database
        let tasksDB;
        //safety try check when parsing json db
        try {
            tasksDB = JSON.parse(data);
        } catch (error) {
            console.error('Error parsing JSON:', error);
            return res.status(500).json({error: 'Database file is currupt'});
        };

        //respond back to client with database
        res.json(tasksDB);
    });
});
//POST update task
tasksR.post('/', (req, res) => {
    //check if main input is provided
    if (!req.body.title) {
        return res.status(400).json({message: 'Please provide at least a task title'});
    };
    //read from database file
    fs.readFile('./db/tasks.json', 'utf8', (err, data) => {
        if(err) {console.error(err)};
        //make in memory array of database
        let tasksDB;
        //safety try check when parsing json db
        try {
            tasksDB = JSON.parse(data);
        } catch (error) {
            console.error('Error parsing JSON:', error);
            return res.status(500).json({error: 'Database file is currupt'});
        };
        //create new task object
        const newTaskBE = {
            id: tasksDB.length > 0 ? Math.max(...tasksDB.map(task => task.id)) + 1 : 1,
            title: req.body.title,
            description: req.body.description,
            priorityLevel: req.body.priorityLevel
        };
        //push to in memory array
        tasksDB.push(newTaskBE);
        //save the update data back to database
        fs.writeFile('./db/tasks.json', JSON.stringify(tasksDB, null, 2), (err) => {
            if(err) {console.error(err)};
            res.status(201).json({message: "New task saved successfully!"});
        });
    });
});
//PUT

//DELETE
tasksR.delete('/:id', (req, res) => {
    //create variable with id
    const taskId = parseInt(req.params.id);
    //read from database file
    fs.readFile('./db/tasks.json', 'utf8', (err, data) => {
        if(err) {console.error(err)};
        //make in memory array of database
        let tasksDB;
        //safety try check when parsing json db
        try {
            tasksDB = JSON.parse(data);
        } catch (error) {
            console.error('Error parsing JSON:', error);
            return res.status(500).json({error: 'Database file is currupt'});
        };

        //check if provided id exists
        const taskToDelete = tasksDB.find(task => task.id === taskId);
        if(!taskToDelete) {
            return res.status(400).json({message: 'Could not find user to delete'});
        };
        //remove task using filter()
        const updatedDB = tasksDB.filter(task => task.id !== taskId);
        
        //write back to the tasks.json database with update
        fs.writeFile('./db/tasks.json', JSON.stringify(updatedDB, null, 2), (err) => {
            if(err) {
                return res.status(500).json({error: 'Could not delete task'});
            };
            //respond back to client
            res.status(201).json({message: 'Task deleted', task: taskToDelete});
        });
    });
});
//DELETE for Completed tasks
tasksR.delete('/completed/:id', (req, res) => {
    //create new date and time in UTC time for consistency in backend
    //UTC time is about 6 hours ahead of Central US Time and is called by .toISOString()
    const nowDateTime = new Date().toISOString();

    //create variable for id
    const taskId = parseInt(req.params.id);
    //read from database file
    fs.readFile('./db/tasks.json', 'utf8', (err, data) => {
        if(err) {console.error(err)};
        //make in memory array of database
        let tasksDB;
        //safety try check when parsing json db
        try {
            tasksDB = JSON.parse(data);
        } catch (error) {
            console.error('Error parsing JSON:', error);
            return res.status(500).json({error: 'Database file is currupt'});
        };
        //check if task exist
        let completedTask = tasksDB.find(task => task.id === taskId);
        if(!completedTask) {
            return res.status(400).json({error: 'Could not find task to complete'});
        };
        //remove task using filter()
        const updatedDB = tasksDB.filter(task => task.id !== taskId);

        //write back to tasks.json with update
        fs.writeFile('./db/tasks.json', JSON.stringify(updatedDB, null, 2), (err) => {
            if(err) {
                return res.status(500).json({error: 'Could not save completed task'});
            };

            //Add task to completed tasks db
            fs.readFile('./db/completedTasks.json', 'utf8', (err, data) => {
                if(err) {console.error(err)}
                //create in memory array of database
                let completedDB;
                //safety try check when parsing json db
                try {
                    completedDB = JSON.parse(data);
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    return res.status(500).json({error: 'Database file is currupt'});
                }
                //update completed task with unique id
                completedTask = {
                    completedId: completedDB > 0 ? Math.max(...completedDB.map(task => task.completedId)) + 1 : 1,
                    ...completedTask,
                    completionDate: nowDateTime
                };
                //push completed task
                completedDB.push(completedTask);
                //save updated data back to completedTasks.json
                fs.writeFile('./db/completedTasks.json', JSON.stringify(completedDB, null, 2), (err) => {
                    if(err) {
                        return res.status(500).json({error: 'Could not add to completed list'});
                    };
                    //respond back to client
                    res.status(201).json({message: 'Task completed', task: completedTask});
                });
            });
        });
    });
});

//export tasksR
module.exports = tasksR;