//import router and dependencies
const completedR = require('express').Router();
const fs = require('fs');

//GET completed tasks
completedR.get('/', (req, res) => {
    //read completedTasks.json db
    fs.readFile('./db/completedTasks.json', 'utf8', (err, data) => {
        if(err) {console.error(err)};
        //create an in memory array of database
        const completedDB = JSON.parse(data);
        //send it back to client
        res.status(200).json(completedDB);
    });
});

//export router
module.exports = completedR;