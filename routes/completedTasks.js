//import router and dependencies
const completedR = require('express').Router();
const fs = require('fs');

//GET completed tasks
completedR.get('/', (req, res) => {
    //read completedTasks.json db
    fs.readFile('./db/completedTasks.json', 'utf8', (err, data) => {
        if(err) {console.error(err)};
        //create an in memory array of database
        let completedDB;
        //safety try check when parsing json
        try {
            completedDB = JSON.parse(data);
        } catch (error) {
            console.error('Error parsing JSON:', error);
            return res.status(500).json({error: 'Database file is currupt'});
        }

        //send it back to client
        res.status(200).json(completedDB);
    });
});

//export router
module.exports = completedR;