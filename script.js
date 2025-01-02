const inputBox = document.querySelector('#input-box');
const listContainer = document.querySelector('#list-container');

// Function to handle strike-through and image toggle
function toggleStrike(event) {
    const button = event.currentTarget;
    const taskText = button.nextElementSibling;
    taskText.classList.toggle('line-through');
    const img = button.querySelector('img');
    img.src = img.src.includes('circle.svg') ? 'check.svg' : 'circle.svg';
}

// Function to delete a task
function deleteTask(event) {
    const taskElement = event.currentTarget.parentElement;
    taskElement.remove();
}

// Function to add a new task
function AddTask() {
    const task = inputBox.value.trim();

    if (!task) {
        alert('Please enter a task');
        return;
    }

    // Create task element
    listContainer.innerHTML += `
        <div class="task flex items-center gap-3 mb-2 justify-between">
            <div class="flex items-center gap-3">
                <button class="toggle-strike">
                    <img src="circle.svg" class="w-6 h-6" />
                </button>
                <p class="text-lg">${task}</p>
            </div>
            <button class="delete-task bg-red-500 text-white text-lg font-bold w-10 h-10 rounded-full hover:bg-red-700 transition">×</button>
        </div>
    `;

    // Attach event listeners to the new buttons
    const newTask = listContainer.lastElementChild;
    newTask.querySelector('.toggle-strike').addEventListener('click', toggleStrike);
    newTask.querySelector('.delete-task').addEventListener('click', deleteTask);

    // Clear input box
    inputBox.value = '';
}

// Add event listeners to existing buttons
document.querySelectorAll('.toggle-strike').forEach(button => {
    button.addEventListener('click', toggleStrike);
});
document.querySelectorAll('.delete-task').forEach(button => {
    button.addEventListener('click', deleteTask);
});
