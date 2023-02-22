import './index.css';

class TodoListData {
  constructor() {
    this.todoListTasks = [];
  }

  addTask(task) {
    task.taskIndex = this.todoListTasks.length;
    this.todoListTasks.push(task);
  }

  removeTask(taskIndex) {
    this.todoListTasks.filter((task) => task.taskIndex !== taskIndex);
  }

  renderList(todoListWrapperElement, drag, drop, allowDrop) {
    todoListWrapperElement.innerHTML = '';
    this.todoListTasks.forEach((task, i) => {
      task.taskIndex = i;
      const label = document.createElement('label');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = `checkbox${task.taskIndex}`;
      const newListTag = document.createElement('input');
      newListTag.value = task.description;
      newListTag.className = 'todo-list-item';
      newListTag.id = `list-item${task.taskIndex}`;
      newListTag.draggable = true;
      newListTag.addEventListener('dragstart', drag);
      newListTag.addEventListener('drop', drop);
      newListTag.addEventListener('dragover', allowDrop);
      label.append(checkbox, newListTag);
      todoListWrapperElement.appendChild(label);
    });
  }
}

const todoListData = new TodoListData();
const todoListWrapperElement = document.getElementById('todo-list-wrap');
const formElement = document.getElementById('form');
const inputElement = document.getElementById('todo-input');

const drag = (event) => {
  event.dataTransfer.setData('dragElementId', event.target.id);
};

const drop = (event) => {
  event.preventDefault();
  const data = event.dataTransfer.getData('dragElementId');
  const dropTarget = event.target;
  if (dropTarget.tagName === 'LI') {
    const draggableElement = document.getElementById(data);
    const dropTargetIndex = Array.from(todoListWrapperElement.children).indexOf(dropTarget);
    const draggableIndex = Array.from(todoListWrapperElement.children).indexOf(draggableElement);

    // Swap the task elements in the array
    const temp = todoListData.todoListTasks[dropTargetIndex];
    todoListData.todoListTasks[dropTargetIndex] = todoListData.todoListTasks[draggableIndex];
    todoListData.todoListTasks[draggableIndex] = temp;

    // Swap the task elements on the page
    todoListWrapperElement.insertBefore(draggableElement, dropTarget);

    // Update the taskIndex property of the tasks
    todoListData.todoListTasks.forEach((task, i) => {
      task.taskIndex = i;
    });
  }
};

const allowDrop = (event) => {
  event.preventDefault();
};

formElement.addEventListener('submit', (event) => {
  event.preventDefault();
  const newTask = {
    description: inputElement.value,
    isCompleted: false,
    taskIndex: null,
  };
  todoListData.addTask(newTask);
  todoListData.renderList(todoListWrapperElement, drag, drop, allowDrop);
});

todoListData.renderList(todoListWrapperElement, drag, drop, allowDrop);
