//Get HTML elements
const formEl = document.getElementById('taskForm');
const taskTitle = document.getElementById('taskTitle');
const taskDescription = document.getElementById('taskDescription');
const taskPriority = document.getElementById('taskPriority');
const btnSubmit = document.getElementById('btnSubmit');
const taskList = document.getElementById('taskList');

//Render Results Function
function renderTasks(record) {
    //create elements
    const divCol = document.createElement('div');
    const divCard = document.createElement('div');
    const divCardBody = document.createElement('div');
    const h5El = document.createElement('h5');
    const pElId = document.createElement('p');
    const pElDesc = document.createElement('p');
    const pElPrio = document.createElement('p');
    //set attributes
    divCol.classList.add('col');
    divCard.classList.add('card', 'h-100');
    divCardBody.classList.add('card-body');
    h5El.classList.add('card-title');
    pElId.classList.add('card-text');
    pElDesc.classList.add('card-text');
    pElPrio.classList.add('card-text');
    //set text
    h5El.textContent = record.title;
    pElId.textContent = `ID: ${record.id}`;
    pElDesc.textContent = `Description: ${record.description}`;
    pElPrio.textContent = `Priority: ${record.priorityLevel}`;
    //append
    divCardBody.append(h5El, pElId, pElDesc, pElPrio);
    divCard.append(divCardBody);
    divCol.append(divCard);
    taskList.append(divCol);
};

//Fetch Functions
//POST
function postTask(task) {
    fetch('/api/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    })
    .then(response => {
        if(!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        getTasks(); // Fetch tasks after POST is done
    })
    .catch(error => console.error('Error', error));
};

//GET
function getTasks() {
    fetch('/api/tasks', {method: 'GET'})
    .then(response => {
        if(!response.ok) {
            throw new Error(`Error: ${response.status}`);
        };
        return response.json();
    })
    .then(data => {
        taskList.textContent = ''; //Clears out content before rendering
        console.log(data);
        data.forEach(record => {
            renderTasks(record);
        });
    })
    .catch(error => console.error('Error Occurred:', error));
};

//Event Listener
btnSubmit.addEventListener('click', (event) => {
    event.preventDefault();
    //create new task based on input
    const newTask = {
        title: taskTitle.value.trim(),
        description: taskDescription.value.trim(),
        priorityLevel: taskPriority.value
    };
    //call post function
    postTask(newTask);

    //clear form contents
    taskTitle.value = '';
    taskDescription.value = '';
    taskPriority.value = 'Low';
});