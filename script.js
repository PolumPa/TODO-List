document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todo-input');
    const addButton = document.getElementById('add-button');
    const todoList = document.getElementById('todo-list');
    const clearButton = document.getElementById('clear-button');

    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    function renderTodos() {
        todoList.innerHTML = '';
        todos.forEach((todo, index) => {
            const todoItem = document.createElement('li');
            todoItem.classList.add('todo-item');
            if (todo.completed) {
                todoItem.classList.add('completed');
            }

            const todoText = document.createElement('span');
            todoText.textContent = todo.text;
            todoText.contentEditable = 'true';
            todoText.classList.add('todo-text');
            todoText.addEventListener('input', () => {
                todos[index].text = todoText.textContent;
                saveTodos();
            });

            const buttonContainer = document.createElement('div');
            buttonContainer.classList.add('button-container');

            const completeButton = document.createElement('button');
            completeButton.textContent = '✔';
            completeButton.addEventListener('click', () => {
                todos[index].completed = !todos[index].completed;
                if (todos[index].completed) {
                    // Перемещаем задачу в конец списка, если она завершена
                    const [completedTodo] = todos.splice(index, 1);
                    todos.push(completedTodo);
                } else {
                    // Перемещаем задачу в начало списка, если она не завершена
                    const [incompleteTodo] = todos.splice(index, 1);
                    let i = 0;
                    while (i < todos.length && !todos[i].completed) {
                        i++;
                    }
                    todos.splice(i, 0, incompleteTodo);
                }
                saveTodos();
                renderTodos();
            });

            const deleteButton = document.createElement('button');
            deleteButton.textContent = '✘';
            deleteButton.addEventListener('click', () => {
                todos.splice(index, 1);
                saveTodos();
                renderTodos();
            });

            buttonContainer.appendChild(completeButton);
            buttonContainer.appendChild(deleteButton);

            todoItem.appendChild(todoText);
            todoItem.appendChild(buttonContainer);

            todoList.appendChild(todoItem);
        });
    }

    function addTodo() {
        const todoText = todoInput.value.trim();
        if (todoText !== '') {
            // Добавляем новую задачу в начало массива
            todos.unshift({ text: todoText, completed: false });
            todoInput.value = '';
            saveTodos();
            renderTodos();
        }
    }

    addButton.addEventListener('click', addTodo);

    todoInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            addTodo();
        }
    });

    clearButton.addEventListener('click', () => {
        todos = [];
        saveTodos();
        renderTodos();
    });

    renderTodos();
});
