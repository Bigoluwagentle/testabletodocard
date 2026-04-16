var taskData = {
  title:       'Redesign the mobile onboarding flow',
  description: 'Update all mobile onboarding screens to match the new brand guidelines and improve the step by step experience for first time users. This includes redesigning the welcome screen, the account setup steps, the feature highlights carousel, and the final confirmation screen before the user lands on the dashboard.',
  priority:    'High',
  dueDate:     '2026-04-18',
  status:      'Pending'
};

var isDone        = false;
var isExpanded    = false;
var timerInterval = null;

var card               = document.getElementById('todo-card');
var viewMode           = document.getElementById('view-mode');
var editForm           = document.getElementById('edit-form');

var titleEl            = document.getElementById('todo-title');
var descriptionEl      = document.getElementById('todo-description');
var priorityBadge      = document.getElementById('priority-badge');
var priorityIndicator  = document.getElementById('priority-indicator');

var dueDateDisplay     = document.getElementById('due-date-display');
var timeRemainingEl    = document.getElementById('time-remaining');
var overdueIndicator   = document.getElementById('overdue-indicator');

var statusDisplay      = document.getElementById('todo-status');
var statusControl      = document.getElementById('status-control');
var checkbox           = document.getElementById('todo-checkbox');

var collapsible        = document.getElementById('collapsible-section');
var expandToggle       = document.getElementById('expand-toggle');

var editBtn            = document.getElementById('edit-btn');
var deleteBtn          = document.getElementById('delete-btn');

var editTitleInput     = document.getElementById('edit-title-input');
var editDescInput      = document.getElementById('edit-description-input');
var editPrioritySelect = document.getElementById('edit-priority-select');
var editDueDateInput   = document.getElementById('edit-due-date-input');
var saveBtn            = document.getElementById('save-btn');
var cancelBtn          = document.getElementById('cancel-btn');

function getTimeRemaining() {
  if (!taskData.dueDate) return { text: 'No due date', overdue: false };

  var due  = new Date(taskData.dueDate + 'T23:59:59');
  var now  = new Date();
  var diff = due - now;
  var abs  = Math.abs(diff);
  var mins = Math.round(abs / 60000);
  var hrs  = Math.floor(abs / 3600000);
  var days = Math.floor(abs / 86400000);
  var past = diff < 0;

  if (abs < 60000) return { text: 'Due now!', overdue: false };

  if (past) {
    if (mins < 60) return { text: 'Overdue by ' + mins + ' minute' + (mins !== 1 ? 's' : ''), overdue: true };
    if (hrs  < 24) return { text: 'Overdue by ' + hrs  + ' hour'   + (hrs  !== 1 ? 's' : ''), overdue: true };
    return           { text: 'Overdue by ' + days + ' day'    + (days !== 1 ? 's' : ''), overdue: true };
  } else {
    if (mins < 60)  return { text: 'Due in ' + mins + ' minute' + (mins !== 1 ? 's' : ''), overdue: false };
    if (hrs  < 24)  return { text: 'Due in ' + hrs  + ' hour'   + (hrs  !== 1 ? 's' : ''), overdue: false };
    if (days === 1) return { text: 'Due tomorrow', overdue: false };
    return           { text: 'Due in ' + days + ' day' + (days !== 1 ? 's' : ''), overdue: false };
  }
}

function updateTimeDisplay() {
  if (isDone) {
    timeRemainingEl.textContent = 'Completed';
    timeRemainingEl.classList.remove('overdue');
    overdueIndicator.style.display = 'none';
    return;
  }

  var result = getTimeRemaining();
  timeRemainingEl.textContent = result.text;

  if (result.overdue) {
    timeRemainingEl.classList.add('overdue');
    overdueIndicator.style.display = 'block';
  } else {
    timeRemainingEl.classList.remove('overdue');
    overdueIndicator.style.display = 'none';
  }
}

function startTimer() {
  clearInterval(timerInterval);
  updateTimeDisplay();
  timerInterval = setInterval(updateTimeDisplay, 30000);
}

function formatDateDisplay(dateStr) {
  if (!dateStr) return 'No due date';
  var d = new Date(dateStr + 'T00:00:00');
  return 'Due ' + d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function applyPriority(priority) {
  var p = priority.toLowerCase();
  priorityBadge.textContent = priority;
  priorityBadge.className   = 'priority-badge ' + p;
  priorityBadge.setAttribute('aria-label', 'Priority: ' + priority);
  priorityIndicator.className = 'priority-indicator ' + p;
}

function applyStatus(status) {
  statusDisplay.textContent = status;
  statusDisplay.setAttribute('aria-label', 'Status: ' + status);

  if (status === 'Pending')     statusDisplay.className = 'status-badge pending';
  if (status === 'In Progress') statusDisplay.className = 'status-badge in-progress';
  if (status === 'Done')        statusDisplay.className = 'status-badge done';

  statusControl.value = status;

  if (status === 'Done') {
    isDone = true;
    checkbox.checked = true;
    titleEl.classList.add('done');
    card.classList.add('is-done');
    collapsible.classList.add('done-mode');
    editBtn.style.display = 'none';
    editBtn.setAttribute('tabindex', '-1');
    editBtn.setAttribute('aria-hidden', 'true');
  } else {
    isDone = false;
    checkbox.checked = false;
    titleEl.classList.remove('done');
    card.classList.remove('is-done');
    collapsible.classList.remove('done-mode');
    editBtn.style.display = '';
    editBtn.removeAttribute('tabindex');
    editBtn.removeAttribute('aria-hidden');
  }

  taskData.status = status;
  updateTimeDisplay();
}

var COLLAPSE_LIMIT = 120;

function setupExpandCollapse() {
  if (taskData.description.length > COLLAPSE_LIMIT) {
    collapsible.classList.add('collapsed');
    collapsible.classList.remove('expanded');
    expandToggle.style.display = '';
    expandToggle.textContent = 'Show more';
    expandToggle.setAttribute('aria-expanded', 'false');
    isExpanded = false;
  } else {
    collapsible.classList.remove('collapsed');
    collapsible.classList.add('expanded');
    expandToggle.style.display = 'none';
    isExpanded = true;
  }
}

expandToggle.addEventListener('click', function () {
  isExpanded = !isExpanded;
  if (isExpanded) {
    collapsible.classList.remove('collapsed');
    collapsible.classList.add('expanded');
    expandToggle.textContent = 'Show less';
    expandToggle.setAttribute('aria-expanded', 'true');
  } else {
    collapsible.classList.add('collapsed');
    collapsible.classList.remove('expanded');
    expandToggle.textContent = 'Show more';
    expandToggle.setAttribute('aria-expanded', 'false');
  }
});

checkbox.addEventListener('change', function () {
  applyStatus(this.checked ? 'Done' : 'Pending');
});

statusControl.addEventListener('change', function () {
  applyStatus(this.value);
});

function openEditMode() {
  editTitleInput.value       = taskData.title;
  editDescInput.value        = taskData.description;
  editPrioritySelect.value   = taskData.priority;
  editDueDateInput.value     = taskData.dueDate;

  viewMode.style.display = 'none';
  editForm.style.display = 'block';
  editTitleInput.focus();
}

function closeEditMode(returnFocus) {
  editForm.style.display = 'none';
  viewMode.style.display = 'block';
  if (returnFocus) {
    editBtn.focus();
  }
}

function saveEdit() {
  var newTitle = editTitleInput.value.trim();
  if (!newTitle) {
    editTitleInput.focus();
    return;
  }

  taskData.title       = newTitle;
  taskData.description = editDescInput.value.trim();
  taskData.priority    = editPrioritySelect.value;
  taskData.dueDate     = editDueDateInput.value;

  titleEl.textContent       = taskData.title;
  descriptionEl.textContent = taskData.description;

  dueDateDisplay.textContent = formatDateDisplay(taskData.dueDate);
  dueDateDisplay.setAttribute('datetime', taskData.dueDate || '');

  applyPriority(taskData.priority);
  setupExpandCollapse();
  startTimer();

  closeEditMode(true);
}

editBtn.addEventListener('click', function () {
  openEditMode();
});

saveBtn.addEventListener('click', function () {
  saveEdit();
});

cancelBtn.addEventListener('click', function () {
  closeEditMode(true);
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && editForm.style.display === 'block') {
    closeEditMode(true);
  }
});

deleteBtn.addEventListener('click', function () {
  alert('Delete clicked');
});

applyPriority(taskData.priority);
applyStatus(taskData.status);
setupExpandCollapse();
startTimer();