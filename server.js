//Import necessary libraries
const express = require('express');
const path = require('path');
const fs = require('fs');
//Create express app
const app = express();
//Define port
const PORT = 3001;

//Import router for tasks
const tasksRoutes = require('./routes/tasks');

//Set up middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
//Set up static folder
app.use(express.static('public'));

//Send homepage html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'public/index.html'));
});
//Use tasks router
app.use('/api/tasks', tasksRoutes);

//Start server
app.listen(PORT, () => {
    console.log(`Now listening at http://localhost:${PORT}`);
});