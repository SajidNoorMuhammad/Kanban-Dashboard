// Task counter for unique IDs
let taskIdCounter = 0;

// Modal
const modal = document.getElementById('modal');
const addTaskBtn = document.getElementById('add-task-btn');
const closeModalBtn = document.querySelector('.close');

addTaskBtn.addEventListener('click', () => {
  modal.style.display = 'block';
});

closeModalBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});

// Form submission
const taskForm = document.getElementById('task-form');

taskForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const taskTitle = document.getElementById('task-title').value;
  const taskDescription = document.getElementById('task-description').value;

  if (taskTitle.trim() === '' || taskDescription.trim() === '') {
    alert('Please fill in all fields');
    return;
  }

  const task = {
    id: `task-${taskIdCounter}`,
    title: taskTitle,
    description: taskDescription
  };

  // Add task to 'To Do' column initially
  addTaskToColumn('todo', task);

  // Save task to localStorage
  saveTask(task);

  // Increment task ID counter
  taskIdCounter++;

  // Clear form fields
  taskForm.reset();

  // Close modal
  modal.style.display = 'none';
});

// Drag and drop functionality
function allowDrop(event) {
  event.preventDefault();
}

function drag(event) {
  event.dataTransfer.setData('text', event.target.id);
}

function drop(event) {
  event.preventDefault();
  const data = event.dataTransfer.getData('text');
  const draggedTask = document.getElementById(data);
  event.target.appendChild(draggedTask);
}

// Functions for adding and saving tasks
function addTaskToColumn(columnId, task) {
  const column = document.getElementById(columnId);
  const taskElement = createTaskElement(task);
  column.appendChild(taskElement);
}

function createTaskElement(task) {
  const taskElement = document.createElement('div');
  taskElement.id = task.id;
  taskElement.className = 'task';
  taskElement.draggable = true;
  taskElement.addEventListener('dragstart', drag);

  taskElement.innerHTML = `
        <h3>${task.title}</h3>
        <p>${task.description}</p>
    `;

  return taskElement;
}

function saveTask(task) {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  tasks.forEach(task => {
    addTaskToColumn('todo', task);
  });

  // Set taskIdCounter to the correct value based on loaded tasks
  if (tasks.length > 0) {
    const lastTaskId = tasks[tasks.length - 1].id;
    taskIdCounter = parseInt(lastTaskId.split('-')[1]) + 1;
  }
});

function deleteTask() {
  localStorage.clear();
}