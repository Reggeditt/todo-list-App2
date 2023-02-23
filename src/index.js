import './index.css';
import TodoListData from './collectionData.js';

const todoListData = new TodoListData();
const todoListWrapperElement = document.getElementById('todo-list-wrap');
const formElement = document.getElementById('form');
const inputElement = document.getElementById('todo-input');
const clearCompletedBtnElement = document.getElementById('clear-completed');
const resetButtonElement = document.getElementById('reset-btn');

// implement drag and drop functionality
const drag = (event) => {
  event.dataTransfer.setData('dragElementId', event.target.id);
};

const drop = (event) => {
  event.preventDefault();
  const data = event.dataTransfer.getData('dragElementId');
  const dropTarget = event.target;
  if (dropTarget.tagName === 'LI') {
    const draggableElement = document.getElementById(data);
    const dropTargetIndex = Array.from(todoListWrapperElement.children).indexOf(
      dropTarget,
    );
    const draggableIndex = Array.from(todoListWrapperElement.children).indexOf(
      draggableElement,
    );

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

// listen for submit of new task
formElement.addEventListener('submit', (event) => {
  event.preventDefault();
  const newTask = {
    description: inputElement.value,
    isCompleted: false,
    taskIndex: null,
  };
  todoListData.addTask(newTask);
  todoListData.renderList(todoListWrapperElement, drag, drop, allowDrop);
  inputElement.value = '';
});

// render the task list on page load
todoListData.renderList(todoListWrapperElement, drag, drop, allowDrop);

clearCompletedBtnElement.addEventListener('click', () => {
  todoListData.clearCompletedTasks();
  todoListData.renderList(todoListWrapperElement, drag, drop, allowDrop);
});

resetButtonElement.addEventListener('click', () => {
  todoListData.resetList();
});