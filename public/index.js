//Get HTML elements
const formEl = document.getElementById('taskForm');
const taskTitle = document.getElementById('taskTitle');
const taskDescription = document.getElementById('taskDescription');
const taskPriority = document.getElementById('taskPriority');
const btnSubmit = document.getElementById('btnSubmit');
const taskList = document.getElementById('taskList');
const completedList = document.getElementById('completedList');
const completedTitle = document.getElementById('completedTitle');

//Render Tasks Function
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
    divCard.classList.add('card', 'h-100', 'shadow', 'bg-body-tertiary', 'rounded');
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
    pElDesc.textContent = `${record.description}`;
    pElPrio.textContent = `Priority: ${record.priorityLevel}`;
    btnCompleted.textContent = 'Completed';
    btnDelete.textContent = 'Delete';
    //append
    divCardBody.append(pElId, pElDesc, pElPrio, btnCompleted, btnDelete);
    divCard.append(h5El, divCardBody);
    divCol.append(divCard);
    taskList.append(divCol);
};
//Render Completed Tasks Function
function renderCompleted(record) {
    //create elements
    const divCol = document.createElement('div');
    const divCard = document.createElement('div');
    const divCardBody = document.createElement('div');
    const h5El = document.createElement('h5');
    const pElDesc = document.createElement('p');
    const pElPrio = document.createElement('p');
    const pElDate = document.createElement('p');
    //set attributes
    divCol.classList.add('col');
    divCard.classList.add('card', 'h-100', 'bg-body-tertiary', 'rounded');
    divCardBody.classList.add('card-body');
    h5El.classList.add('card-header', 'text-body-secondary');
    pElDesc.classList.add('card-text');
    pElPrio.classList.add('card-text');
    pElDate.classList.add('card-footer', 'mb-0', 'text-body-secondary');
    //set text
    h5El.textContent = record.title;
    pElDesc.textContent = `${record.description}`;
    pElPrio.textContent = `Priority: ${record.priorityLevel}`;
    pElDate.textContent = `Completed on: ${record.completionDate}`;
    //append
    divCardBody.append(pElDesc, pElPrio);
    divCard.append(h5El, divCardBody, pElDate);
    divCol.append(divCard);
    completedList.append(divCol);
}

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

//DELETE from main database
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
    .then(data => {
        alert(data.message);
        getTasks() //gets the fresh set of tasks
    })
    .catch(error => {
        console.error('Error:', error.message);
        alert(error.message);
    });
};
//DELETE from main database but add it to completed database
function completeTask(id) {
    fetch(`/api/tasks/completed/${id}`, {method: 'DELETE'})
    .then(response => {
        if(!response.ok) {
            return response.json().then(errData => {
                throw new Error(errData.error);
            });
        }
        return response.json();
    })
    .then(data => {
        alert(data.message);
        console.log(data);
        getTasks(); //gets the fresh set of tasks
        getCompletedTasks(); //gets the fresh set of completed tasks
    })
    .catch(error => {
        console.error('Error:', error.error);
        alert(error.error);
    });
};

//GET: live tasks
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
        data.forEach(record => {
            renderTasks(record);
        });
    })
    .catch(error => console.error('Error Occurred:', error));
};
//Display live tasks on app start by default
getTasks();

//GET: completed tasks
function getCompletedTasks() {
    fetch('api/completedTasks', {method: 'GET'})
    .then(response => {
        if(!response.ok) {throw new Error(`Error: ${response.status}`)};
        return response.json();
    })
    .then(data => {
        completedList.textContent = ''; //Clears out content before rendering
        data.forEach(record => {
            renderCompleted(record);
        });
    })
    .catch(error => console.error('Error Occured:', error));
};
//Display completed tasks on app start by default
getCompletedTasks();

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
//On delete and completed buttons
taskList.addEventListener('click', (event) => {
    event.preventDefault();
    //check which button was clicked
    if(event.target.tagName === 'BUTTON') {
        //capture the card task id and parent
        const taskId = event.target.parentElement.children[0].textContent;
        const taskCard = event.target.parentElement.parentElement.parentElement;

        if (event.target.textContent === 'Delete') {
            //call on delete task function
            deleteTask(taskId);
        } else if (event.target.textContent === 'Completed') {
            //call on complete task function
            completeTask(taskId);
        };
    };
});