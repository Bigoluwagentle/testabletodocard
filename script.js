var dueDate = new Date('2026-04-18T23:59:59');

function getTimeRemaining() {
  var now  = new Date();
  var diff = dueDate - now;
  var abs  = Math.abs(diff);
  var mins = Math.round(abs / 60000);
  var hrs  = Math.round(abs / 3600000);
  var days = Math.round(abs / 86400000);
  var past = diff < 0;

  if (abs < 60000) return { text: 'Due now!', overdue: false };

  if (past) {
    if (mins < 60) return { text: 'Overdue by ' + mins + ' min' + (mins !== 1 ? 's' : ''), overdue: true };
    if (hrs  < 24) return { text: 'Overdue by ' + hrs  + ' hour' + (hrs  !== 1 ? 's' : ''), overdue: true };
    return           { text: 'Overdue by ' + days + ' day'  + (days !== 1 ? 's' : ''), overdue: true };
  } else {
    if (hrs  < 24)  return { text: 'Due today',    overdue: false };
    if (days === 1) return { text: 'Due tomorrow', overdue: false };
    return           { text: 'Due in ' + days + ' day' + (days !== 1 ? 's' : ''), overdue: false };
  }
}

function updateTimeRemaining() {
  var span   = document.getElementById('time-remaining');
  var result = getTimeRemaining();
  span.textContent = result.text;
  if (result.overdue) {
    span.classList.add('overdue');
  } else {
    span.classList.remove('overdue');
  }
}

updateTimeRemaining();
setInterval(updateTimeRemaining, 60000);

document.getElementById('todo-checkbox').addEventListener('change', function () {
  var title  = document.getElementById('todo-title');
  var status = document.getElementById('todo-status');
  var timeSpan = document.getElementById('time-remaining');
  var editBtn  = document.getElementById('edit-btn');

  if (this.checked) {
    title.classList.add('done');

    status.textContent = 'Done';
    status.className   = 'status-badge done';
    status.setAttribute('aria-label', 'Status: Done');

    timeSpan.closest('div.meta-row').style.display = 'none';

    editBtn.style.display  = 'none';
    editBtn.setAttribute('aria-hidden', 'true');
    editBtn.setAttribute('tabindex', '-1');

  } else {
    title.classList.remove('done');

    status.textContent = 'Pending';
    status.className   = 'status-badge pending';
    status.setAttribute('aria-label', 'Status: Pending');

    timeSpan.closest('div.meta-row').style.display = '';

    editBtn.style.display = '';
    editBtn.removeAttribute('aria-hidden');
    editBtn.removeAttribute('tabindex');

    updateTimeRemaining();
  }
});

document.getElementById('edit-btn').addEventListener('click', function () {
  console.log('edit clicked');
});

document.querySelector('[data-testid="test-todo-delete-button"]').addEventListener('click', function () {
  alert('Delete clicked');
});