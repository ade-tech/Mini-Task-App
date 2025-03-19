const taskForm = document.querySelector<HTMLFormElement>(".form")!;
const formInput = document.querySelector<HTMLInputElement>(".form-input")!;
const taskListElement = document.querySelector<HTMLUListElement>(".list")!;

interface Task {
  description: string;
  isCompleted: boolean;
}

let tasks: Task[] = [];

function submitTask(e: SubmitEvent) {
  e.preventDefault();
  const taskDescription = formInput.value;
  if (taskDescription) {
    const newTask = { description: taskDescription, isCompleted: false };
    addTask(newTask);
    render(newTask);
    formInput.value = "";
    return;
  } else {
    alert("Add a Task Please!");
  }
}

taskForm.addEventListener("submit", submitTask);

function addTask(task: Task): void {
  tasks.push(task);
  saveToLocalStorage();
}

const deleteTask = (taskDescription: string): void => {
  console.log(taskDescription);
  tasks = tasks.filter((task) => task.description !== taskDescription);
  saveToLocalStorage();
  renderAllTasks();
};

const saveToLocalStorage = (): void => {
  localStorage.setItem("task", JSON.stringify(tasks));
};

function UpdateTask(taskDescription: string) {
  tasks.forEach((task) => {
    if (task.description === taskDescription) {
      task.isCompleted = !task.isCompleted;
    }
  });
  saveToLocalStorage();
}

function render(task: Task): void {
  const li = document.createElement("li");
  const checkbox = document.createElement("input");
  checkbox.classList.add("item-check");
  checkbox.type = "checkbox";
  checkbox.checked = task.isCompleted;
  li.appendChild(checkbox);
  const taskText = document.createElement("p");
  taskText.textContent = task.description;
  li.appendChild(taskText);
  const cancel = document.createElement("button");
  cancel.innerHTML = "X";
  cancel.classList.add("btn-cancel");
  li.appendChild(cancel);
  taskListElement.append(li);
}

function renderAllTasks(): void {
  taskListElement.innerHTML = "";
  tasks.map((task) => render(task));
  saveToLocalStorage();
}

function load(): void {
  const itemsInLocalStorage = localStorage.getItem("task");
  if (!itemsInLocalStorage) {
    return;
  }
  const parsedItem: Task[] = JSON.parse(itemsInLocalStorage);
  tasks = parsedItem;
  renderAllTasks();
}

document.addEventListener("change", (e) => {
  const checkBox = e.target as HTMLInputElement;

  if (checkBox.type === "checkbox") {
    const listItemDescription = checkBox
      .closest("li")
      ?.querySelector("p")?.textContent;
    if (listItemDescription) UpdateTask(listItemDescription);
  }
});

document.addEventListener("click", (e) => {
  const target = e.target as HTMLButtonElement;

  if (target.classList.contains("btn-cancel")) {
    e.preventDefault();

    const listItemDescription = target
      .closest("li")
      ?.querySelector("p")?.textContent;

    console.log(target, listItemDescription);

    if (listItemDescription) deleteTask(listItemDescription);
  }
});

window.addEventListener("load", load);
