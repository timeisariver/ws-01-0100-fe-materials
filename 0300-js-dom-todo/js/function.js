const state = {
  showCompleted: false,
  tasks: [
    {
      id: '1',
      name: 'Task 1',
      deadline: new AppDate().getDateInXMonth(1),
      completed: false,
    },
    {
      id: '2',
      name: 'Task 2',
      deadline: new AppDate().getDateInXMonth(2),
      completed: false,
    },
    {
      id: '3',
      name: 'Task 3',
      deadline: new AppDate().getDateInXMonth(3),
      completed: false,
    },
  ],
};

// ↓↓↓ ここを実装
function removeHTML(container) {
  container.replaceChildren();
}

function updateTask(tasks, id, changes) {
  return tasks.map((t) => {
    if (t.id === id) {
      return { ...t, ...changes };
    }
    return t;
  });
}

function setTasks(container, newTasks) {
  state.tasks = newTasks;
  renderTasks(container, state.tasks, state.showCompleted);
}

function visibleTasks(tasks, showCompleted) {
  return tasks.filter((task) => {
    return showCompleted || !task.completed;
  });
}

function col(klass, child) {
  const column = div(klass);
  column.append(child);
  return column;
}

function renderTasks(container, tasks, showCompleted) {
  removeHTML(container);

  visibleTasks(tasks, showCompleted).forEach((task) => {
    // ロウ作成
    const row = div('content__row');

    // カラム1
    const check = checkbox(task.completed, (checked) => {
      const newTasks = updateTask(tasks, task.id, {
        completed: checked,
      });

      setTasks(container, newTasks);
    });
    row.append(col('content__col', check));

    // カラム2
    const taskNameInput = document.createElement('input');
    taskNameInput.type = 'text';
    taskNameInput.value = task.name;
    taskNameInput.addEventListener('change', (e) => {
      const newTasks = updateTask(tasks, task.id, {
        name: e.target.value,
      });

      setTasks(container, newTasks);
    });
    row.append(col('content__col content__col--name', taskNameInput));

    // カラム3
    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.value = task.deadline.toString();
    dateInput.addEventListener('change', (e) => {
      const deadline = AppDate.parse(e.target.value);

      if (!deadline) {
        renderTasks(container, tasks, showCompleted);
        return;
      }

      const newTasks = updateTask(tasks, task.id, {
        deadline,
      });

      setTasks(container, newTasks);
    });
    row.append(col('content__col content__col--deadline', dateInput));

    // カラム4
    const deleteIcon = icon('icon icon--trash fa-solid fa-trash', () => {
      if (confirm('タスクを削除してもいいですか？')) {
        const newTasks = tasks.filter((t) => t.id !== task.id);

        setTasks(container, newTasks);
      }
    });
    row.append(col('content__col', deleteIcon));

    // ロウ追加
    container.append(row);
  });
}

function onSubmitTask(container) {
  const inputName = document.getElementById('js-task-name');
  const inputDeadline = document.getElementById('js-task-deadline');

  const inputNameValue = inputName.value.trim();

  if (!inputNameValue) return;

  const newTasks = [
    ...state.tasks,
    {
      id: crypto.randomUUID(),
      name: inputNameValue,
      deadline: inputDeadline.value
        ? AppDate.parse(inputDeadline.value)
        : new AppDate(),
      completed: false,
    },
  ];

  setTasks(container, newTasks);

  inputName.value = '';
  inputDeadline.value = '';
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

      renderTasks(todoContainer, state.tasks, state.showCompleted);
    });
  renderTasks(todoContainer, state.tasks, state.showCompleted);
}

main();
