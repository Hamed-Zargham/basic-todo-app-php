// DOM Elements
const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const taskIdInput = document.getElementById('task-id');

/*
 * Function to render tasks in the table
 * Takes the list of tasks and dynamically generates HTML to display them in the table.
 */
const renderTasks = (tasks) => {
  // Map each fetched task to its HTML representation
  const taskRows = tasks.map((task) => `
      <tr>
          <td>${task.title}</td>
          <td>${task.description}</td>
          <td>
              <button class="btn btn-sm btn-warning edit-btn" data-id="${task.id}" data-title="${task.title}" data-description="${task.description}">Edit</button>
              <button class="btn btn-sm btn-danger delete-btn" data-id="${task.id}">Delete</button>
          </td>
      </tr>
  `);

  // Combine all task rows into a single string
  const tasksHTML = taskRows.join('');

  // Insert the generated HTML into the table
  taskList.innerHTML = tasksHTML;

  // Attach event listeners to new edit task and delete task buttons each time tasks are rendred
  addButtonEventListeners();
};

// Function to fetch all tasks from the database and pass the retrieved tasks to the renderTasks function.
const fetchTasks = () => {
  fetch('app.php')
    .then((response) => response.json())
    .then((tasks) => renderTasks(tasks))
    .catch((error) => console.error('Error fetching tasks:', error));
};

// Add or Update Task
taskForm.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent form submit

  // Prepare the task data to send to backend
  const taskData = {
    title: titleInput.value,
    description: descriptionInput.value,
    id: taskIdInput.value || null, // Include the task ID if editing, otherwise null
  };

  // Send the task data to the backend
  fetch('app.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData),
  })
    .then((response) => response.json()) // Parse the backend's response
    .then(() => {
      fetchTasks(); // Refresh the task list
      taskForm.reset(); // Reset all the form fields to their initial values
      taskIdInput.value = ''; // Clear the value of the hidden input field
    })
    .catch((error) => console.error('Error saving task:', error));
});

// Edit Task
const editTask = (id, title, description) => {
  titleInput.value = title; // Populate the title input field
  descriptionInput.value = description; // Populate the description input field
  taskIdInput.value = id; // Set the task ID for updating
};

// Delete Task
const deleteTask = (id) => {
  fetch(`app.php?id=${id}`, { method: 'DELETE' }) // Send a DELETE request to the backend
    .then((response) => response.json()) // Parse the backend's response
    .then(() => fetchTasks()) // Refresh the task list
    .catch((error) => console.error('Error deleting task:', error));
};

function addButtonEventListeners() {
  // Add event listeners to all "Edit" buttons
  document.querySelectorAll('.edit-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const title = btn.getAttribute('data-title');
      const description = btn.getAttribute('data-description');
      editTask(id, title, description);
    });
  });

  // Add event listeners to all "Delete" buttons
  document.querySelectorAll('.delete-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      deleteTask(id);
    });
  });
}

// Initial fetch of tasks
fetchTasks();
