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
    const btnCompleted = document.createElement('button');
    const btnDelete = document.createElement('button');
    //set attributes
    divCol.classList.add('col');
    divCard.classList.add('card', 'h-100');
    divCardBody.classList.add('card-body');
    h5El.classList.add('card-header');
    pElId.classList.add('card-text', 'visually-hidden');
    pElDesc.classList.add('card-text');
    pElPrio.classList.add('card-text');
    btnCompleted.classList.add('btn', 'btn-success', 'me-3');
    btnDelete.classList.add('btn', 'btn-danger');
    //set text
    h5El.textContent = record.title;
    pElId.textContent = record.id;
    pElDesc.textContent = `Description: ${record.description}`;
    pElPrio.textContent = `Priority: ${record.priorityLevel}`;
    btnCompleted.textContent = 'Completed';
    btnDelete.textContent = 'Delete';
    //append
    divCardBody.append(pElId, pElDesc, pElPrio, btnCompleted, btnDelete);
    divCard.append(h5El, divCardBody);
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
            return response.json().then(errData => {
                throw new Error(errData.message); //Extracts error message from response
            });
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        getTasks(); // Fetch tasks after POST is done
    })
    .catch(error => {
        console.error('Error:', error.message); //logs extracted error message
        alert(error.message); //displays an error alert to the user
    });
};
//PUT
//DELETE
function deleteTask(id) {
    fetch(`/api/tasks/${id}`, {method: 'DELETE'})
    .then(response => {
        if(!response.ok) {
            return response.json().then(errData => {
                throw new Error(errData.message);
            });
        }
        return response.json();
    })
    .then(data => alert(data.message))
    .catch(error => {
        console.error('Error:', error.message);
        alert(error.message);
    });
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
//Display tasks on app opening by default
getTasks();

//Event Listeners
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
//On delete button
taskList.addEventListener('click', (event) => {
    event.preventDefault();
    //check which button was clicked
    if(event.target.tagName === 'BUTTON' && event.target.textContent === 'Delete') {
        //capture the card task id and parent
        const taskId = event.target.parentElement.children[0].textContent;
        const taskCard = event.target.parentElement.parentElement.parentElement;
        //call on delete task function
        deleteTask(taskId);
        //remove from UI
        taskCard.remove();
    };
});