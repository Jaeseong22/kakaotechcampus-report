const PASTEL_COLORS = ['#e6f0ff', '#f0e6ff', '#fff9e6', '#ffe6f0', '#e6ffe6'];
const TODO_STORAGE_KEY = 'todoVanillaDailyItems';

let todos = [];
let activeTab = 'active';
let searchQuery = '';
let selectedDate = new Date();

selectedDate.setHours(0, 0, 0, 0);

const todoGrid = document.getElementById('todoGrid');
const sidebarTodoList = document.getElementById('sidebarTodoList');
const searchInput = document.getElementById('searchInput');
const tabs = document.querySelectorAll('.tab');
const weekDaysContainer = document.getElementById('weekDaysContainer');
const weekRangeLabel = document.getElementById('weekRangeLabel');
const prevWeekBtn = document.getElementById('prevWeekBtn');
const nextWeekBtn = document.getElementById('nextWeekBtn');

const modalOverlay = document.getElementById('modalOverlay');
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const addTodoForm = document.getElementById('addTodoForm');
const todoTitleInput = document.getElementById('todoTitleInput');
const todoDescriptionInput = document.getElementById('todoDescriptionInput');
const todoStartTimeInput = document.getElementById('todoStartTimeInput');
const todoEndTimeInput = document.getElementById('todoEndTimeInput');
const formMessage = document.getElementById('formMessage');

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getStartOfWeek(date) {
  const copiedDate = new Date(date);
  copiedDate.setHours(0, 0, 0, 0);

  const day = copiedDate.getDay(); // 0: 일, 1: 월, ...
  const diffToMonday = day === 0 ? -6 : 1 - day;
  copiedDate.setDate(copiedDate.getDate() + diffToMonday);
  return copiedDate;
}

function getWeekDates(baseDate) {
  const startOfWeek = getStartOfWeek(baseDate);
  const weekDates = [];

  for (let index = 0; index < 7; index += 1) {
    const weekDate = new Date(startOfWeek);
    weekDate.setDate(startOfWeek.getDate() + index);
    weekDates.push(weekDate);
  }

  return weekDates;
}

function updateWeekRangeLabel() {
  const weekDates = getWeekDates(selectedDate);
  const startDate = weekDates[0];
  const endDate = weekDates[6];

  const startLabel = `${startDate.getMonth() + 1}월 ${startDate.getDate()}일`;
  const endLabel = `${endDate.getMonth() + 1}월 ${endDate.getDate()}일`;
  weekRangeLabel.textContent = `${startLabel} ~ ${endLabel}`;
}

function getTodoCountByDate(date) {
  const dateKey = formatDateKey(date);
  return todos.filter((todo) => todo.dateKey === dateKey).length;
}

function isSameDate(dateA, dateB) {
  return formatDateKey(dateA) === formatDateKey(dateB);
}

function renderWeekView() {
  weekDaysContainer.innerHTML = '';

  const weekDates = getWeekDates(selectedDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayNames = ['월', '화', '수', '목', '금', '토', '일'];

  weekDates.forEach((date, index) => {
    const dayCard = document.createElement('button');
    dayCard.type = 'button';
    dayCard.className = 'week-day-card';

    if (isSameDate(date, selectedDate)) {
      dayCard.classList.add('selected');
    }

    if (isSameDate(date, today)) {
      dayCard.classList.add('today');
    }

    const todoCount = getTodoCountByDate(date);
    dayCard.innerHTML = `
      <p class="week-day-name">${dayNames[index]}</p>
      <p class="week-day-date">${date.getDate()}일</p>
      <p class="week-day-count">Todo ${todoCount}개</p>
    `;

    dayCard.addEventListener('click', () => {
      selectedDate = new Date(date);
      selectedDate.setHours(0, 0, 0, 0);
      renderWeekView();
      renderTodos();
    });

    weekDaysContainer.appendChild(dayCard);
  });

  updateWeekRangeLabel();
}

function saveTodosToLocalStorage() {
  localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos));
}

function persistTodos() {
  saveTodosToLocalStorage();
  renderWeekView();
  renderTodos();
}

function loadTodosFromLocalStorage() {
  const savedValue = localStorage.getItem(TODO_STORAGE_KEY);

  if (!savedValue) {
    return;
  }

  try {
    const parsedTodos = JSON.parse(savedValue);

    if (Array.isArray(parsedTodos)) {
      // 저장 데이터 구조가 바뀌어도 기본 필드를 보정해서 복원한다.
      todos = parsedTodos.map((todo, index) => ({
        id: String(todo.id ?? Date.now() + index),
        title: String(todo.title ?? ''),
        description: String(todo.description ?? '설명이 없습니다.'),
        time: String(todo.time ?? '시간 미정'),
        color: String(
          todo.color ?? PASTEL_COLORS[index % PASTEL_COLORS.length]
        ),
        completed: Boolean(todo.completed),
        dateKey: String(todo.dateKey ?? formatDateKey(selectedDate)),
      }));

      // 예전 데이터(dateKey 없음)도 한 번 보정 저장해 이후부터 안정적으로 사용한다.
      saveTodosToLocalStorage();
    }
  } catch (error) {
    console.error('로컬스토리지 데이터를 불러오지 못했습니다.', error);
  }
}

function showFormMessage(text = '') {
  formMessage.textContent = text;
}

function formatTodoTime(timeValue) {
  if (!timeValue) {
    return '시간 미정';
  }

  const splitTime = timeValue.split(':');

  if (splitTime.length === 2) {
    return `${splitTime[0]}:${splitTime[1]}:00`;
  }

  return timeValue;
}

function formatTodoTimeRange(startTimeValue, endTimeValue) {
  const formattedStartTime = formatTodoTime(startTimeValue);
  const formattedEndTime = formatTodoTime(endTimeValue);

  if (!startTimeValue && !endTimeValue) {
    return '시간 미정';
  }

  if (startTimeValue && !endTimeValue) {
    return `${formattedStartTime} - 미정`;
  }

  if (!startTimeValue && endTimeValue) {
    return `미정 - ${formattedEndTime}`;
  }

  return `${formattedStartTime} - ${formattedEndTime}`;
}

function getVisibleTodos() {
  const selectedDateKey = formatDateKey(selectedDate);

  return todos.filter((todo) => {
    if (todo.dateKey !== selectedDateKey) {
      return false;
    }

    if (activeTab === 'active' && todo.completed) {
      return false;
    }

    if (activeTab === 'completed' && !todo.completed) {
      return false;
    }

    return todo.title.toLowerCase().includes(searchQuery.toLowerCase());
  });
}

function renderTodos() {
  todoGrid.innerHTML = '';
  const visibleTodos = getVisibleTodos();

  if (visibleTodos.length === 0) {
    todoGrid.innerHTML = `
      <div class="empty-message">
        현재 날짜/상태 조건에 맞는 할 일이 없습니다.
      </div>
    `;
    renderSidebarTodos();
    return;
  }

  visibleTodos.forEach((todo) => {
    const card = document.createElement('div');
    card.className = `todo-card ${todo.completed ? 'completed' : ''}`;
    card.style.backgroundColor = todo.color;

    card.innerHTML = `
      <div class="card-header">
        <div class="card-title-group">
          <h3 class="card-title">${todo.title}</h3>
        </div>
      </div>
      <p class="card-desc">${todo.description || '설명이 없습니다.'}</p>
      <div class="card-time">${todo.time || '시간 미정'}</div>
      <div class="card-actions">
        <button class="card-action-btn edit" data-action="edit">수정</button>
        <button class="card-action-btn complete" data-action="toggle">
          ${todo.completed ? '완료 해제' : '완료'}
        </button>
        <button class="card-action-btn delete" data-action="delete">삭제</button>
      </div>
    `;

    card.dataset.id = todo.id;
    todoGrid.appendChild(card);
  });

  renderSidebarTodos();
}

function renderSidebarTodos() {
  sidebarTodoList.innerHTML = '';

  const selectedDateKey = formatDateKey(selectedDate);
  const activeTodos = todos.filter(
    (todo) => todo.dateKey === selectedDateKey && !todo.completed
  );

  if (activeTodos.length === 0) {
    sidebarTodoList.innerHTML = `
      <span class="sub-menu-item" style="font-style: italic;">
        진행 중인 할 일이 없습니다
      </span>
    `;
    return;
  }

  activeTodos.forEach((todo) => {
    const item = document.createElement('span');
    item.className = 'sub-menu-item';
    item.textContent = todo.title;
    item.title = todo.title;
    sidebarTodoList.appendChild(item);
  });
}

function updateTodo(id) {
  const targetTodo = todos.find((todo) => todo.id === id);

  if (!targetTodo) {
    return;
  }

  const updatedTitle = prompt('수정할 제목을 입력하세요.', targetTodo.title);

  if (updatedTitle === null) {
    return;
  }

  const trimmedTitle = updatedTitle.trim();

  if (!trimmedTitle) {
    return;
  }

  const updatedDescription = prompt(
    '수정할 설명을 입력하세요.',
    targetTodo.description || ''
  );

  if (updatedDescription === null) {
    return;
  }

  const updatedTime = prompt('수정할 시간을 입력하세요. (예: 14:00:00)', targetTodo.time || '');

  if (updatedTime === null) {
    return;
  }

  targetTodo.title = trimmedTitle;
  targetTodo.description = updatedDescription.trim() || '설명이 없습니다.';
  targetTodo.time = updatedTime.trim() || '시간 미정';

  persistTodos();
}

function toggleComplete(id) {
  todos = todos.map((todo) =>
    todo.id === id
      ? {
          ...todo,
          completed: !todo.completed,
        }
      : todo
  );

  persistTodos();
}

function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  persistTodos();
}

function addTodo(title, description, startTime, endTime) {
  const newTodo = {
    id: Date.now().toString(),
    title,
    description: description || '설명이 없습니다.',
    time: formatTodoTimeRange(startTime, endTime),
    color: PASTEL_COLORS[todos.length % PASTEL_COLORS.length],
    completed: false,
    dateKey: formatDateKey(selectedDate),
  };

  todos.push(newTodo);
  activeTab = 'active';
  updateActiveTabUI();
  persistTodos();
}

function openModal() {
  showFormMessage('');
  modalOverlay.classList.add('show');
  todoTitleInput.focus();
}

function closeModal() {
  modalOverlay.classList.remove('show');
  todoTitleInput.value = '';
  todoDescriptionInput.value = '';
  todoStartTimeInput.value = '';
  todoEndTimeInput.value = '';
  showFormMessage('');
}

function updateActiveTabUI() {
  tabs.forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.tab === activeTab);
  });
}

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    activeTab = tab.dataset.tab;
    updateActiveTabUI();
    renderTodos();
  });
});

searchInput.addEventListener('input', (event) => {
  searchQuery = event.target.value;
  renderTodos();
});

openModalBtn.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);

modalOverlay.addEventListener('click', (event) => {
  if (event.target === modalOverlay) {
    closeModal();
  }
});

addTodoForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const title = todoTitleInput.value.trim();
  const description = todoDescriptionInput.value.trim();
  const startTime = todoStartTimeInput.value.trim();
  const endTime = todoEndTimeInput.value.trim();

  if (!title) {
    showFormMessage('제목을 입력해야 할 일을 추가할 수 있습니다.');
    return;
  }

  addTodo(title, description, startTime, endTime);
  closeModal();
});

todoGrid.addEventListener('click', (event) => {
  const clickedButton = event.target.closest('button');

  if (!clickedButton) {
    return;
  }

  const cardElement = clickedButton.closest('.todo-card');

  if (!cardElement) {
    return;
  }

  const todoId = cardElement.dataset.id;
  const actionType = clickedButton.dataset.action;

  if (actionType === 'edit') {
    updateTodo(todoId);
  }

  if (actionType === 'toggle') {
    toggleComplete(todoId);
  }

  if (actionType === 'delete') {
    deleteTodo(todoId);
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeModal();
  }
});

loadTodosFromLocalStorage();
updateActiveTabUI();
renderWeekView();
renderTodos();

prevWeekBtn.addEventListener('click', () => {
  selectedDate.setDate(selectedDate.getDate() - 7);
  renderWeekView();
  renderTodos();
});

nextWeekBtn.addEventListener('click', () => {
  selectedDate.setDate(selectedDate.getDate() + 7);
  renderWeekView();
  renderTodos();
});
