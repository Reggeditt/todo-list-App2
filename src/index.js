import './index.css';

const todoListTasks = [
  {
    description: 'Wash the dishes',
    isCompleted: false,
    taskIndex: null,
  },
  {
    description: 'Clear the room',
    isCompleted: false,
    taskIndex: null,
  },
  {
    description: 'Buy groceries',
    isCompleted: false,
    taskIndex: null,
  },
];

const todoListWrapperElement = document.getElementById('todo-list-wrap');

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
    const temp = todoListTasks[dropTargetIndex];
    todoListTasks[dropTargetIndex] = todoListTasks[draggableIndex];
    todoListTasks[draggableIndex] = temp;

    // Swap the task elements on the page
    todoListWrapperElement.insertBefore(draggableElement, dropTarget);

    // Update the taskIndex property of the tasks
    todoListTasks.forEach((task, i) => {
      task.taskIndex = i;
    });
  }
};

const allowDrop = (event) => {
  event.preventDefault();
};

todoListTasks.forEach((task, i) => {
  task.taskIndex = i;
  const newListTag = document.createElement('li');
  newListTag.textContent = task.description;
  newListTag.className = 'todo-list-item';
  newListTag.id = `list-item${task.taskIndex}`;
  newListTag.draggable = true;
  newListTag.addEventListener('dragstart', drag);
  newListTag.addEventListener('drop', drop);
  newListTag.addEventListener('dragover', allowDrop);
  todoListWrapperElement.appendChild(newListTag);
});
