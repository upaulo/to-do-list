const taskTextInput = document.getElementById('task-text-input');
const addTaskBtn = document.getElementById('add-task-btn');
const tasksList = document.getElementById('tasks-list');
const errorDiv = document.getElementById('error-message');

const storageTasks = JSON.parse(localStorage.getItem('tasks')) || [];

function updateLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(storageTasks));
}

function showErrorMessage(message) {
  errorDiv.innerText = message;
  errorDiv.style.display = 'block';
}

function clearErrorMessage() {
  errorDiv.innerHTML = '';
  errorDiv.style.display = '';
}

function validateInput(taskText) {
  if (!taskText) {
    showErrorMessage('Type something!');
    return false;
  }

  if (storageTasks.find((task) => task.text === taskText)) {
    showErrorMessage('This task already exists');
    return false;
  }

  return true;
}

function toggleTaskCompleted(index) {
  storageTasks[index].completed = !storageTasks[index].completed;
  updateLocalStorage();
  window.location.reload();
}

function swapTasks(indexA, indexB) {
  const temp = storageTasks[indexA];
  storageTasks[indexA] = storageTasks[indexB];
  storageTasks[indexB] = temp;
}

function moveTask(direction, index) {
  const newIndex = direction === 'up' ? index - 1 : index + 1;
  swapTasks(index, newIndex);
  updateLocalStorage();
  window.location.reload();
}

function deleteTask(index) {
  storageTasks.splice(index, 1);
  updateLocalStorage();
  window.location.reload();
}

function createButton(id, iconSrc, clickHandler) {
  const button = document.createElement('button');
  button.id = id;
  const icon = document.createElement('img');
  icon.src = iconSrc;
  button.appendChild(icon);
  button.addEventListener('click', clickHandler);
  return button;
}

function createButtonsContainer(index) {
  const buttonsContainer = document.createElement('div');
  buttonsContainer.classList.add('buttons-container');

  if (index > 0) {
    const upBtn = createButton('up-btn', './assets/up.svg', () => moveTask('up', index));
    buttonsContainer.appendChild(upBtn);
  }

  if (index < storageTasks.length - 1) {
    const downBtn = createButton('down-btn', './assets/down.svg', () => moveTask('down', index));
    buttonsContainer.appendChild(downBtn);
  }

  const deleteBtn = createButton('remove-btn', './assets/trash.svg', () => deleteTask(index));
  buttonsContainer.appendChild(deleteBtn);

  return buttonsContainer;
}

function renderTasks() {
  tasksList.innerHTML = '';

  storageTasks.forEach((task, index) => {
    const taskElement = document.createElement('li');
    taskElement.textContent = task.text;

    if (task.completed) {
      taskElement.classList.add('task-completed');
    }

    taskElement.addEventListener('dblclick', () => toggleTaskCompleted(index));

    const buttonsContainer = createButtonsContainer(index);
    taskElement.appendChild(buttonsContainer);
    tasksList.appendChild(taskElement);
  });
}

function createTask() {
  const taskText = taskTextInput.value.trim();

  if (!validateInput(taskText)) return;

  storageTasks.push({ text: taskText, completed: false });
  taskTextInput.value = '';
  clearErrorMessage();
  updateLocalStorage();
  renderTasks();
}

taskTextInput.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') createTask();
});

addTaskBtn.addEventListener('click', createTask);

window.addEventListener('load', () => {
  taskTextInput.value = '';
  renderTasks();
});
