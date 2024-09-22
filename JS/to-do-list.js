const listContainer = document.getElementById('list-container');
const input = document.getElementById('task');
const btn = document.getElementById('add');
const doneTasks = document.getElementById('done');
const allTasks = document.getElementById('all');

document.addEventListener('DOMContentLoaded', loadTasks);

// Add New Task 
function addNewTask() {

    const taskValue = input.value.trim();

    if (taskValue == '') {
        alert('Please enter a new task!');
    } else {
        const taskElement = createTaskElement(taskValue , false);
        listContainer.appendChild(taskElement);
        input.value = '';
        updateTotalTasks();
        saveTasksToLocal();
    }

}
btn.addEventListener('click', addNewTask);

// create task elemet 
function createTaskElement(taskValue , completed) {

    // create list Element
    const task = document.createElement('li');
    task.classList.add('task');
    if (completed) {
        task.classList.add('completed');
    }

    // create check icon 
    const checkIcon = document.createElement('i');
    checkIcon.classList.add('fas', 'fa-check');
    checkIcon.addEventListener('click', () => {
        task.classList.toggle('completed');
        updateDoneTasks();
        saveTasksToLocal();
    });

    // create span with the task value 
    const taskText = document.createElement('span');
    taskText.textContent = taskValue;

    // create delete icon 
    const deleteIcon = document.createElement('i');
    deleteIcon.classList.add('fas', 'fa-times', 'delete');
    deleteIcon.addEventListener('click', () => {
        task.remove();
        updateDoneTasks();
        updateTotalTasks();
        saveTasksToLocal();
    });

    task.appendChild(checkIcon);
    task.appendChild(taskText);
    task.appendChild(deleteIcon);

    return task;
}

// Load tasks from local storage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Clear the list before appending tasks
    listContainer.innerHTML = ''; 

    tasks.forEach(task => {
        const taskElement = createTaskElement(task.text, task.completed);
        listContainer.appendChild(taskElement);
    });

    updateTotalTasks();
    updateDoneTasks();
}



// Delete Tasks & Completed Tasks
const updateDoneTasks = () => {
    const completedTasks = document.querySelectorAll('li.completed').length;
    doneTasks.textContent = completedTasks;
}

const updateTotalTasks = () => {
    const currentTasks = document.querySelectorAll('#list-container li').length;
    allTasks.textContent = currentTasks;
}

listContainer.addEventListener('click', (event) => {
    const task = event.target.closest('li');

    if (!task) return;

    if (event.target.classList.contains('delete')) {
        task.remove();
        updateDoneTasks();
        updateTotalTasks();
    } else {
        task.classList.toggle('completed');
        updateDoneTasks();
    }

    saveTasksToLocal();

});

// Filter Tasks
const filterButtons = document.querySelectorAll('.filter-btn');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filter = button.getAttribute('data-filter');
        const tasks = document.querySelectorAll('#list-container li');

        tasks.forEach(task => {
            if (filter === 'all') {
                task.classList.remove('unchosen');
                task.classList.add('show');
            } else if (filter === 'completed' && task.classList.contains('completed')) {
                task.classList.remove('unchosen');
                task.classList.add('show');
            } else if (filter === 'pending' && !task.classList.contains('completed')) {
                task.classList.remove('unchosen');
                task.classList.add('show');
            } else {
                task.classList.remove('show');
                task.classList.add('unchosen');
            }
        });
    });
});

// Save tasks to local storage
function saveTasksToLocal() {
    const tasks = [];
    const taskElements = document.querySelectorAll('#list-container li');

    taskElements.forEach(task => {
        const taskText = task.querySelector('span').textContent;
        const completed = task.classList.contains('completed');
        tasks.push({ text: taskText, completed });
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

