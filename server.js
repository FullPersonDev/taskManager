//Import necessary libraries
const express = require('express');
const path = require('path');
const fs = require('fs');
//Create express app
const app = express();
//Define port
const PORT = 3001;

//Set up middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
//Set up static folder
app.use(express.static('public'));

//Set up Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});
app.get('/api/tasks', (req, res) => {
    const tasksDB = JSON.parse(fs.readFileSync('./db/tasks.json'));
    res.json(tasksDB);
});
app.post('/api/tasks', (req, res) => {
    //read simulated database and create an in-memory copy
    const tasksDB = JSON.parse(fs.readFileSync('./db/tasks.json'));
    //create new task object for backend
    const newTaskBE = {
        id: tasksDB.length > 0 ? Math.max(...tasksDB.map(task => task.id)) + 1 : 1,
        title: req.body.title,
        description: req.body.description,
        priorityLevel: req.body.priorityLevel
    };
    //push to in momory variable
    tasksDB.push(newTaskBE);
    //save to JSON file to simulate saving to DB
    fs.writeFileSync('./db/tasks.json', JSON.stringify(tasksDB, null, 2), 'utf8');

    //respond back to client
    const response = {
        message: 'Task Posted Successfully!',
        task: newTaskBE
    };
    res.status(201).json(response);
});

//Start server
app.listen(PORT, () => {
    console.log(`Now listening at http://localhost:${PORT}`);
});