export default class TodoListData {
  constructor() {
    this.todoListTasks = JSON.parse(window.localStorage.getItem('todoList')) || [];
    this.taskRemoveButtons = [];
  }

  addTask = (task) => {
    task.taskIndex = this.todoListTasks.length + 1;
    this.todoListTasks.push(task);
    this.updateStorage();
  }

  removeTask = (index) => {
    this.todoListTasks = this.todoListTasks.filter((task) => task.taskIndex !== index);
    this.todoListTasks.forEach((task, i) => {
      task.taskIndex = i + 1;
    });
    this.updateStorage();
  }

  clearCompletedTasks = () => {
    this.todoListTasks = this.todoListTasks.filter((task) => task.isCompleted === false);
    this.todoListTasks.forEach((task, i) => {
      task.taskIndex = i + 1;
    });
    this.updateStorage();
  }

  resetList = () => {
    this.todoListTasks = [];
    this.updateStorage();
    window.location.reload();
  }

  renderList = (todoListWrapperElement, drag, drop, allowDrop) => {
    todoListWrapperElement.innerHTML = '';
    this.todoListTasks = JSON.parse(window.localStorage.getItem('todoList')) || [];
    this.todoListTasks.forEach((task, i) => {
      task.taskIndex = i + 1;

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
      const removeBtn = document.createElement('button');
      removeBtn.className = 'todo-list-item-remove';
      removeBtn.dataset.id = task.taskIndex;
      const newListTag = document.createElement('li');
      newListTag.className = 'todo-list-item';
      newListTag.id = `list-item${task.taskIndex}`;

      // implement drag and drop functionality
      newListTag.draggable = true;
      newListTag.addEventListener('dragstart', drag);
      newListTag.addEventListener('drop', drop);
      newListTag.addEventListener('dragover', allowDrop);
      newListTag.append(checkbox, listDescription, removeBtn);
      todoListWrapperElement.appendChild(newListTag);
      this.taskRemoveButtons.push(removeBtn);
    });

    // toggle isCompleted to true/false when checkbox is checked/unchecked
    const todoListWrapperChildren = Array.from(todoListWrapperElement.children);
    todoListWrapperChildren.forEach((child, index) => {
      child.children[0].addEventListener('click', () => {
        if (child.children[0].checked) {
          child.children[1].style.textDecoration = 'line-through';
          this.todoListTasks[index].isCompleted = true;
          this.updateStorage();
        } else {
          child.children[1].style.textDecoration = 'none';
          this.todoListTasks[index].isCompleted = false;
          this.updateStorage();
        }
      });
    });

    // add event listener to input field to toggle styling and update task description
    const listDescriptionArr = document.getElementsByClassName('todo-list-item-description');
    const inputFields = Array.from(listDescriptionArr);
    inputFields.forEach((input, i) => {
      input.addEventListener('click', () => {
        if (document.activeElement === input) {
          todoListWrapperElement.children[i].style.backgroundColor = 'yellow';
          todoListWrapperElement.children[i].children[2].style.display = 'block';
          input.style.backgroundColor = 'yellow';
          todoListWrapperChildren[i].style.setProperty('--before', 'none');
        } else {
          todoListWrapperElement.children[i].style.backgroundColor = 'white';
          todoListWrapperElement.children[i].children[2].style.display = 'none';
          input.style.backgroundColor = 'white';
          todoListWrapperChildren[i].style.setProperty('--before', 'block');
        }
      });

      input.addEventListener('change', () => {
        this.todoListTasks[i].description = input.value;
        todoListWrapperElement.children[i].style.backgroundColor = 'white';
        todoListWrapperElement.children[i].children[2].style.display = 'none';
        input.style.backgroundColor = 'white';
        todoListWrapperChildren[i].style.setProperty('--before', 'block');
        document.getElementById('todo-input').focus();
        this.updateStorage();
      });
    });

    // add event listener to delete button to remove task from the list
    this.taskRemoveButtons.forEach((button) => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.removeTask(+e.target.dataset.id);
        this.renderList(todoListWrapperElement, drag, drop, allowDrop);
      });
    });
  }

  // Update local storage
  updateStorage = () => {
    localStorage.setItem('todoList', JSON.stringify(this.todoListTasks));
    this.todoListTasks = JSON.parse(window.localStorage.getItem('todoList'));
  }
}