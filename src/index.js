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

      /* create elements for each task which includes a checkbox,
      input field and a delete button nested in a list tag */
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = `checkbox${task.taskIndex}`;
      checkbox.dataset.id = task.taskIndex;
      const listDescription = document.createElement('input');
      listDescription.type = 'text';
      listDescription.className = 'todo-list-item-description';
      listDescription.value = task.description;
      const taskRemoveBtn = document.createElement('button');
      taskRemoveBtn.className = 'todo-list-item-remove';
      taskRemoveBtn.dataset.id = task.taskIndex;
      const newListTag = document.createElement('li');
      newListTag.className = 'todo-list-item';
      newListTag.id = `list-item${task.taskIndex}`;

      // implement drag and drop functionality
      newListTag.draggable = true;
      newListTag.addEventListener('dragstart', drag);
      newListTag.addEventListener('drop', drop);
      newListTag.addEventListener('dragover', allowDrop);
      newListTag.append(checkbox, listDescription, taskRemoveBtn);
      todoListWrapperElement.appendChild(newListTag);
    });

    // toggle isCompleted to true/false when checkbox is checked/unchecked
    const todoListWrapperChildren = Array.from(todoListWrapperElement.children);
    todoListWrapperChildren.forEach((child, index) => {
      child.children[0].addEventListener('click', () => {
        if (child.children[0].checked) {
          child.children[1].style.textDecoration = 'line-through';
          this.todoListTasks[index].isCompleted = true;
        } else {
          child.children[1].style.textDecoration = 'none';
          this.todoListTasks[index].isCompleted = false;
        }
      });
    });

    // add event listener to input field to toggle styling and update task description
    const inputFields = Array.from(document.getElementsByClassName('todo-list-item-description'));
    inputFields.forEach((input, i) => {
      input.addEventListener('focus', () => {
        todoListWrapperElement.children[i].style.backgroundColor = 'yellow';
        todoListWrapperElement.children[i].children[2].style.display = 'block';
        input.style.backgroundColor = 'yellow';
      });
      input.addEventListener('focusout', () => {
        todoListWrapperElement.children[i].style.backgroundColor = 'white';
        todoListWrapperElement.children[i].children[2].style.display = 'none';
        input.style.backgroundColor = 'white';
      });
      input.addEventListener('change', () => {
        this.todoListTasks[i].description = input.value;
        todoListWrapperElement.children[i].style.backgroundColor = 'white';
        todoListWrapperElement.children[i].children[2].style.display = 'none';
        input.style.backgroundColor = 'white';
        input.focus = false;
      });
    });

    // add event listener to delete button to remove task from the list
    const removeBtns = Array.from(document.getElementsByClassName('todo-list-item-remove'));
    removeBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const taskIndex = btn.dataset.id;
        console.log('taskIndex: ', taskIndex);
        this.removeTask(taskIndex);
      });
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
