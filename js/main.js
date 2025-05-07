const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const descriptionInput = document.querySelector('#descriptionInput');
const tagsInput = document.querySelector('#tagsInput');
const dueDateInput = document.querySelector('#dueDateInput');
const priorityInput = document.querySelector('#priorityInput');
const tasksList = document.querySelector('#tasksList');
const searchInput = document.querySelector('#searchInput');
const priorityFilter = document.querySelector('#priorityFilter');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Инициализация списка задач
tasks.forEach(renderTask);
setInterval(saveToLocalStorage, 30000);

// Добавление задачи
form.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = taskInput.value;
    const description = descriptionInput.value;
    const tags = tagsInput.value.split(',').map(tag => tag.trim());
    const dueDate = dueDateInput.value;
    const priority = priorityInput.value;

    if (!title || tags.length === 0) {
        alert('Название и теги обязательны');
        return;
    }

    const newTask = {
        id: Date.now(),
        title,
        description,
        tags,
        dueDate,
        priority,
        done: false
    };

    tasks.push(newTask);
    renderTask(newTask);
    saveToLocalStorage();

    form.reset();
});

function renderTask(task) {
    const taskHTML = `
        <li id="${task.id}" class="list-group-item d-flex justify-content-between align-items-center">
            <div>
                <h5>${task.title}</h5>
                <p>${task.description}</p>
                <small>${task.dueDate} | Приоритет: ${task.priority}</small>
                <div>Теги: ${task.tags.join(', ')}</div>
            </div>
            <div>
                <button data-action="done" class="btn btn-success">✔</button>
                <button data-action="delete" class="btn btn-danger">✖</button>
            </div>
        </li>`;
    tasksList.insertAdjacentHTML('beforeend', taskHTML);
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

tasksList.addEventListener('click', (event) => {
    const action = event.target.dataset.action;
    if (!action) return;

    const taskItem = event.target.closest('li');
    const taskId = Number(taskItem.id);
    const task = tasks.find(t => t.id === taskId);

    if (action === 'delete') {
        tasks = tasks.filter(t => t.id !== taskId);
        taskItem.remove();
    } else if (action === 'done') {
        task.done = !task.done;
        taskItem.classList.toggle('task-done');
    }

    saveToLocalStorage();
});

searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    const filteredTasks = tasks.filter(task => 
        task.title.toLowerCase().includes(query) || task.description.toLowerCase().includes(query)
    );
    tasksList.innerHTML = '';
    filteredTasks.forEach(renderTask);
});

priorityFilter.addEventListener('change', () => {
    const selectedPriority = priorityFilter.value;
    const filteredTasks = tasks.filter(task => 
        selectedPriority === 'all' || task.priority === selectedPriority
    );
    tasksList.innerHTML = '';
    filteredTasks.forEach(renderTask);
});
