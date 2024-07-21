const form = document.getElementById("form");
const taskInput = document.getElementById("add-task-input");
const addBtn = document.getElementById("add-task-btn");
const listContainer = document.getElementById("list-container");
const counterElement = document.getElementById("counter-p");
const checkedTasksElement = document.getElementById("checked-tasks");

let tasks = [];
let counter = 0;
let checkedTasks = 0;

const handleCheckBox = (checkboxInput, taskInputElement, index) => {
  if (checkboxInput.checked) {
    taskInputElement.classList.add("checked");
    tasks[index].checked = true;
    checkedTasks++;
  } else {
    taskInputElement.classList.remove("checked");
    tasks[index].checked = false;
    checkedTasks--;
  }
  updateCompletedTasks();
  localStorage.setItem("tasks", JSON.stringify(tasks));
  console.log(checkedTasks);
};

const addTask = (e) => {
  e.preventDefault();

  if (taskInput.value) {
    tasks.push(taskInput.value);
    renderTaskList();

    counter++;
    updateCounter();
  } else {
    alert("You must enter a task.");
  }
  localStorage.setItem("tasks", JSON.stringify(tasks));
  taskInput.value = "";
};


const deleteTask = (index) => {
  try {
    const confirmDelete = confirm("Are you sure?");
    if (index >= 0 && index < tasks.length && confirmDelete) {
      tasks.splice(index, 1);
      counter--;
      updateCounter();
      updateCompletedTasks();
      renderTaskList();
      localStorage.setItem("tasks", JSON.stringify(tasks));
    } else {
      throw error("Something went wrong. Please try again.");
    }
  } catch (error) {
    console.error(error);
  }
};

const editTask = (index) => {
  const taskInputElement = document.querySelectorAll(".task")[index];
  const editBtn = document.querySelectorAll(".edit-btn")[index];
  try {
      if (editBtn.innerText === "Edit") {
        taskInputElement.removeAttribute("readonly");
        taskInputElement.focus();
        editBtn.innerText = "Save";
      } else {
        tasks[index] = taskInputElement.value;
        taskInputElement.setAttribute("readonly", "readonly");
        editBtn.innerText = "Edit";
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTaskList();
      }
    
  } catch (error) {
    console.error(error);
  }
  
}

const updateCompletedTasks = () => {
  checkedTasksElement.innerText = "Completed tasks: " + checkedTasks;
}

const updateCounter = () => {
  counterElement.innerText = "Number of tasks: " + counter;
  localStorage.setItem("counter", JSON.stringify(counter));
}

const renderTaskList = () => {
  listContainer.innerHTML = "";

  for (let i = 0; i < tasks.length; i++) {
    const divElement = document.createElement("div");

    const checkboxInput = document.createElement("input");
    checkboxInput.type = "checkbox";
    checkboxInput.checked = tasks[i].checked;
    checkboxInput.addEventListener("click", () => {
      tasks[i].checked = checkboxInput.checked;
      handleCheckBox(checkboxInput, taskInputElement, i);
      localStorage.setItem("tasks", JSON.stringify(tasks));
    });

    const taskInputElement = document.createElement("input");
    taskInputElement.type = "text";
    taskInputElement.className = tasks[i].checked ? "task checked" : "task";
    taskInputElement.value = tasks[i];
    taskInputElement.setAttribute("readonly", "readonly");

    const editBtn = document.createElement("button");
    editBtn.innerText = "Edit";
    editBtn.className = "edit-btn";
    editBtn.addEventListener("click", () => editTask(i));

    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.className = "delete-btn";
    deleteBtn.addEventListener("click", () => deleteTask(i)); 

    divElement.appendChild(checkboxInput);
    divElement.appendChild(taskInputElement);
    divElement.appendChild(editBtn);
    divElement.appendChild(deleteBtn);
    listContainer.appendChild(divElement);

  }
};

form.addEventListener("submit", addTask);

const showTasks = JSON.parse(localStorage.getItem("tasks"));
const showCounter = JSON.parse(localStorage.getItem("counter")); 

if (showTasks) {
  tasks = showTasks;
  checkedTasks = tasks.filter(task => task.checked).length; 
  updateCompletedTasks();
  renderTaskList();
} else{
  listContainer.innerText = "No tasks yet.";
}

if (showCounter) {
  counter = showCounter;
  updateCounter();
} else{
  listContainer.innerText = "No tasks yet.";
}
//localStorage.clear(); 
