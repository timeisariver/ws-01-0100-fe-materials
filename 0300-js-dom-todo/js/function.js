const state = {
  showCompleted: false,
  tasks: [
    {
      name: 'Task 1',
      deadline: new AppDate().getDateInXMonth(1),
      completed: false,
    },
    {
      name: 'Task 2',
      deadline: new AppDate().getDateInXMonth(2),
      completed: false,
    },
    {
      name: 'Task 3',
      deadline: new AppDate().getDateInXMonth(3),
      completed: false,
    },
  ],
};

// ↓↓↓ ここを実装
function renderTasks(container) {
  removeHTML(container);

  state.tasks.forEach((task) => {
    if (!state.showCompleted && task.completed) return;

    // ロウ作成
    const row = div('content__row');

    // カラム1
    const col1 = div('content__col');
    const check = checkbox(task.completed, (checked) => {
      task.completed = checked;
      renderTasks(container);
    });
    col1.append(check);
    row.append(col1);

    // カラム2
    const col2 = div('content__col content__col--name');
    const taskNameInput = document.createElement('input');
    taskNameInput.type = 'text';
    taskNameInput.value = task.name;
    taskNameInput.addEventListener('change', (e) => {
      task.name = e.target.value;
    });
    col2.append(taskNameInput);
    row.append(col2);

    // カラム3
    const col3 = div('content__col content__col--deadline');
    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.value = task.deadline;
    dateInput.addEventListener('change', (e) => {
      task.deadline = AppDate.parse(e.target.value);
    });
    col3.append(dateInput);
    row.append(col3);

    // カラム4
    const col4 = div('content__col');
    const deleteIcon = icon('icon icon--trash fa-solid fa-trash', () => {
      if (confirm('タスクを削除してもいいですか？')) {
        const newTasks = state.tasks.filter((t) => t !== task);
        state.tasks = newTasks;
        renderTasks(container);
      }
    });
    col4.append(deleteIcon);
    row.append(col4);

    // ロウ追加
    container.append(row);
  });
}

function removeHTML(container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}

function onSubmitTask(container) {
  const inputName = document.getElementById('js-task-name');
  const inputDeadline = document.getElementById('js-task-deadline');

  state.tasks.push({
    name: inputName.value,
    deadline: inputDeadline.value
      ? AppDate.parse(inputDeadline.value)
      : new AppDate(),
    completed: false,
  });

  inputName.value = '';
  inputDeadline.value = '';

  renderTasks(container);
}
// ↑↑↑

function main() {
  const todoContainer = document.querySelector('.js-list-container');

  document.querySelector('.js-form').addEventListener('submit', (e) => {
    e.preventDefault();
    onSubmitTask(todoContainer);
  });

  document
    .querySelector('.js-show-completed')
    .addEventListener('change', (e) => {
      state.showCompleted = e.target.checked;
      renderTasks(todoContainer);
    });
  renderTasks(todoContainer);
}

main();
