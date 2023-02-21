import './index.css';

const todoListTasks = [
  {
    description: 'Wash the dishes',
    isCompleted: false,
    taskIndex: null,
  },
  {
    description: 'clear the room',
    isCompleted: false,
    taskIndex: null,
  },
  {
    description: 'buy groceries',
    isCompleted: false,
    taskIndex: null,
  },
];

const todoListWrapperElement = document.getElementById('todo-list-wrap');
todoListTasks.forEach((task, i) => {
  task.taskIndex = i;
  const newListTag = document.createElement('li');
  newListTag.textContent = task.description;
  newListTag.className = 'todo-list-item';
  todoListWrapperElement.appendChild(newListTag);
});
