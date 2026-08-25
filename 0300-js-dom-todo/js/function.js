const state = {
  showCompleted: false,
  tasks: [
    {
      name: 'Task 1',
      deadline: new AppDate().getDateInXMonth(1),
    },
    {
      name: 'Task 2',
      deadline: new AppDate().getDateInXMonth(2),
    },
    {
      name: 'Task 3',
      deadline: new AppDate().getDateInXMonth(3),
    },
  ],
};

// ↓↓↓ ここを実装
function renderTasks(container) {
  state.tasks.forEach((task) => {
    const tr = document.createElement('tr');
    tr.classList.add('content__table-row');

    const td1 = document.createElement('td');
    const checkbox1 = document.createElement('input');
    checkbox1.type = 'checkbox';
    td1.append(checkbox1);

    const td2 = document.createElement('td');
    td2.innerHTML = task.name;

    const td3 = document.createElement('td');
    const checkbox2 = document.createElement('input');
    checkbox2.type = 'date';
    checkbox2.value = task.deadline;
    td3.append(checkbox2);

    const td4 = document.createElement('td');
    const button = document.createElement('button');
    const icon = document.createElement('i');
    td4.append(button);
    icon.classList.add('icon', 'icon--trash', 'fa-solid', 'fa-trash');
    button.append(icon);

    tr.append(td1, td2, td3, td4);
    container.append(tr);
  });
}

function removeTasks(container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}

function onSubmitTask(container) {
  const taskName = document.getElementById('js-task-name').value;
  const taskDeadline = document.getElementById('js-task-deadline').value;

  state.tasks.push({
    name: taskName,
    deadline: taskDeadline ? new AppDate(taskDeadline) : new AppDate(),
  });

  removeTasks(container);
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
