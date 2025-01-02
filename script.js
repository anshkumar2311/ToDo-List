const inputBox = document.querySelector('#input-box');
const todoContainer = document.querySelector('#list-container');
const containers = document.querySelectorAll('.list-none');

// Load tasks from localStorage
document.addEventListener('DOMContentLoaded', loadTasks);

// strike-through, delete, edit
function handleTaskAction(event) {
    const target = event.target;

    // Strike-through toggle
    if (target.closest('.toggle-strike')) {
        const button = target.closest('.toggle-strike');
        const taskText = button.nextElementSibling;
        taskText.classList.toggle('line-through');
        const img = button.querySelector('img');
        img.src = img.src.includes('circle.svg') ? 'check.svg' : 'circle.svg';
        saveTasks();
    }

    // Delete task
    if (target.closest('.delete-task')) {
        const taskElement = target.closest('.task');
        taskElement.remove();
        saveTasks();
    }

    // Edit task
    if (target.tagName === 'P') {
        const taskText = target;
        const currentText = taskText.textContent;
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentText;
        input.classList.add('text-lg', 'w-full', 'bg-transparent', 'outline-none', 'border-b', 'border-gray-400', 'mb-2');
        taskText.replaceWith(input);

        input.addEventListener('blur', () => {
            const updatedText = input.value.trim();
            const newTaskText = document.createElement('p');
            newTaskText.textContent = updatedText || currentText; // Revert to old text if empty
            newTaskText.classList.add('text-lg');
            input.replaceWith(newTaskText);
            saveTasks();
        });

        input.focus();
    }
}

// Add event listener to all containers for task actions
containers.forEach((container) => {
    container.addEventListener('click', handleTaskAction);
});

// Function to add a new task
function AddTask() {
    const task = inputBox.value.trim();

    if (!task) {
        alert('Please enter a task');
        return;
    }

    // Create task element
    const taskElement = createTaskElement(task);

    // Append to the To-Do container
    todoContainer.appendChild(taskElement);

    // Clear input box
    inputBox.value = '';

    // Save tasks to localStorage
    saveTasks();
}

// Create a task element
function createTaskElement(taskText, isCompleted = false) {
    const taskElement = document.createElement('li');
    taskElement.classList.add('task', 'flex', 'items-center', 'gap-3', 'mb-2', 'justify-between', 'bg-white', 'text-black', 'p-2', 'rounded-lg');
    taskElement.setAttribute('draggable', 'true');

    // Add drag event listeners
    addDragListeners(taskElement);

    // Add inner HTML
    taskElement.innerHTML = `
        <div class="flex items-center gap-3">
            <button class="toggle-strike">
                <img src="${isCompleted ? 'check.svg' : 'circle.svg'}" class="w-6 h-6" />
            </button>
            <p class="text-lg ${isCompleted ? 'line-through' : ''}">${taskText}</p>
        </div>
        <button class="delete-task bg-pink-500 text-white text-lg font-bold w-10 h-10 rounded-full hover:bg-pink-700 transition">×</button>
    `;

    return taskElement;
}

// Drag-and-Drop Handlers
let draggedTask = null;

function addDragListeners(taskElement) {
    taskElement.addEventListener('dragstart', (event) => {
        draggedTask = event.target;
        event.target.classList.add('opacity-50');
    });

    taskElement.addEventListener('dragend', (event) => {
        event.target.classList.remove('opacity-50');
        draggedTask = null;
        saveTasks();
    });
}

containers.forEach((container) => {
    container.addEventListener('dragover', (event) => {
        event.preventDefault(); // Allow drop

        const afterElement = getDragAfterElement(container, event.clientY);
        const dragged = draggedTask;

        if (afterElement == null) {
            container.appendChild(dragged);
        } else {
            container.insertBefore(dragged, afterElement);
        }

        saveTasks();
    });
});

// dragged task should be inserted
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.task:not(.opacity-50)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Save tasks to localStorage
function saveTasks() {
    const tasks = [];
    containers.forEach((container) => {
        const taskElements = container.querySelectorAll('.task');
        const taskData = [...taskElements].map((task) => {
            const taskText = task.querySelector('p').textContent;
            const isCompleted = task.querySelector('p').classList.contains('line-through');
            return { text: taskText, isCompleted };
        });
        tasks.push(taskData);
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (!savedTasks) return;

    savedTasks.forEach((taskGroup, index) => {
        const container = containers[index];
        taskGroup.forEach(({ text, isCompleted }) => {
            const taskElement = createTaskElement(text, isCompleted);
            container.appendChild(taskElement);
        });
    });
}
