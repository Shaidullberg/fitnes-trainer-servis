// Получение элементов DOM
const addClientBtn = document.getElementById("addClientBtn");
const addClientPopup = document.getElementById("addClientPopup");
const addClientForm = document.getElementById("addClientForm");
const clientTable = document.getElementById("clientTable").getElementsByTagName("tbody")[0];

const addWorkoutBtn = document.getElementById("addWorkoutBtn");
const addWorkoutPopup = document.getElementById("addWorkoutPopup");
const addWorkoutForm = document.getElementById("addWorkoutForm");
const workoutTable = document.getElementById("workoutTable").getElementsByTagName("tbody")[0];
const workoutClientSelect = document.getElementById("workoutClient");

const addPaymentBtn = document.getElementById("addPaymentBtn");
const addPaymentPopup = document.getElementById("addPaymentPopup");
const addPaymentForm = document.getElementById("addPaymentForm");
const paymentTable = document.getElementById("paymentTable").getElementsByTagName("tbody")[0];
const paymentClientSelect = document.getElementById("paymentClient");

// Функции для работы с LocalStorage
function getClients() {
  const clients = localStorage.getItem("clients");
  return clients ? JSON.parse(clients) : [];
}

function saveClients(clients) {
  localStorage.setItem("clients", JSON.stringify(clients));
}

function getWorkouts() {
  const workouts = localStorage.getItem("workouts");
  return workouts ? JSON.parse(workouts) : [];
}

function saveWorkouts(workouts) {
  localStorage.setItem("workouts", JSON.stringify(workouts));
}

function getPayments() {
  const payments = localStorage.getItem("payments");
  return payments ? JSON.parse(payments) : [];
}

function savePayments(payments) {
  localStorage.setItem("payments", JSON.stringify(payments));
}

// Функции для работы с клиентами
function addClient(event) {
  event.preventDefault();

  const lastName = document.getElementById("lastName").value;
  const firstName = document.getElementById("firstName").value;
  const paymentType = document.getElementById("paymentType").value;

  const clients = getClients();
  const newClient = { lastName, firstName, paymentType, balance: 0 };
  clients.push(newClient);
  saveClients(clients);

  renderClientsTable();
  updateClientSelects();
  addClientForm.reset();
  addClientPopup.style.display = "none";
}

function renderClientsTable() {
  clientTable.innerHTML = "";
  const clients = getClients();

  clients.forEach((client, index) => {
    const newRow = clientTable.insertRow();
    newRow.insertCell().textContent = client.lastName;
    newRow.insertCell().textContent = client.firstName;
    newRow.insertCell().textContent = client.paymentType;
    newRow.insertCell().textContent = client.balance;

    // Добавление кнопки "удалить"
    const deleteCell = newRow.insertCell();
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X"; 
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click", () => {
      deleteClient(index);
    });
    deleteCell.appendChild(deleteBtn);
  });
}

function updateClientSelects() {
  workoutClientSelect.innerHTML = "";
  paymentClientSelect.innerHTML = "";

  const clients = getClients();
  clients.forEach((client) => {
    const option1 = document.createElement("option");
    option1.value = client.lastName;
    option1.textContent = client.lastName;
    workoutClientSelect.appendChild(option1);

    const option2 = document.createElement("option");
    option2.value = client.lastName;
    option2.textContent = client.lastName;
    paymentClientSelect.appendChild(option2);
  });
}

// Функции для работы с тренировками
function addWorkout(event) {
  event.preventDefault();

  const clientName = document.getElementById("workoutClient").value;
  const workoutDate = document.getElementById("workoutDate").value;
  const workoutTime = document.getElementById("workoutTime").value;

  const workouts = getWorkouts();
  const newWorkout = { clientName, workoutDate, workoutTime, completed: false };
  workouts.push(newWorkout);
  saveWorkouts(workouts);

  renderWorkoutsTable();
  addWorkoutForm.reset();
  addWorkoutPopup.style.display = "none";
}

function renderWorkoutsTable() {
  workoutTable.innerHTML = "";
  const workouts = getWorkouts();

  workouts.forEach((workout, index) => {
    const newRow = workoutTable.insertRow();
    newRow.insertCell().textContent = workout.workoutDate;
    newRow.insertCell().textContent = workout.workoutTime;
    newRow.insertCell().textContent = workout.clientName;

    const completedCell = newRow.insertCell();
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = workout.completed;
    checkbox.addEventListener("change", () => {
      toggleWorkoutCompletion(index);
    });
    completedCell.appendChild(checkbox);

    // Добавление кнопки "удалить"
    const deleteCell = newRow.insertCell();
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click", () => {
      deleteWorkout(index);
    });
    deleteCell.appendChild(deleteBtn);
  });
}

function toggleWorkoutCompletion(index) {
  const workouts = getWorkouts();
  const workout = workouts[index];
  workout.completed = !workout.completed;
  saveWorkouts(workouts);

  const clients = getClients();
  const clientIndex = clients.findIndex(
    (client) => client.lastName === workout.clientName
  );

  if (clientIndex !== -1) {
    const workoutCost = parseFloat(document.getElementById("workoutCost").value); // Получаем стоимость
    const amountToDeduct = workout.completed ? -workoutCost : workoutCost; // Вычисляем сумму

    clients[clientIndex].balance += amountToDeduct;
    saveClients(clients);
    renderClientsTable();
  }

  renderWorkoutsTable();
}


// Функции для работы с платежами
function addPayment(event) {
  event.preventDefault();

  const clientName = document.getElementById("paymentClient").value;
  const paymentDate = document.getElementById("paymentDate").value;
  const paymentType = document.getElementById("paymentTypeAdd").value;
  const paymentAmount = parseFloat(document.getElementById("paymentAmount").value);
  // Убираем workoutCost из этой функции

  const payments = getPayments();
  const newPayment = {
    clientName,
    paymentDate,
    paymentType,
    paymentAmount,
  };
  payments.push(newPayment);
  savePayments(payments);

  // Обновление баланса клиента БЕЗ учета стоимости тренировки:
  updateClientBalance(clientName, paymentAmount, "add"); // Просто добавляем сумму

  renderPaymentsTable();
  addPaymentForm.reset();
  addPaymentPopup.style.display = "none";
}

function renderPaymentsTable() {
  paymentTable.innerHTML = "";
  const payments = getPayments();

  payments.forEach((payment, index) => {
    const newRow = paymentTable.insertRow();
    newRow.insertCell().textContent = payment.paymentDate;
    newRow.insertCell().textContent = payment.clientName;
    newRow.insertCell().textContent = payment.paymentType;
    newRow.insertCell().textContent = payment.paymentAmount;

    // Добавление кнопки "удалить"
    const deleteCell = newRow.insertCell();
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click", () => {
      deletePayment(index);
    });
    deleteCell.appendChild(deleteBtn);
  });
}

// Функция для обновления баланса клиента
function updateClientBalance(clientName, amount, operation) {
  const clients = getClients();
  const clientIndex = clients.findIndex(
    (client) => client.lastName === clientName
  );

  if (clientIndex !== -1) {
    if (operation === "add") {
      clients[clientIndex].balance += amount;
    } else if (operation === "subtract") {
      clients[clientIndex].balance -= amount;
    }
    saveClients(clients);
    renderClientsTable();
  }
}

// Функции для удаления данных
function deleteClient(index) {
  const clients = getClients();
  clients.splice(index, 1);
  saveClients(clients);
  renderClientsTable();
  updateClientSelects(); // Обновляем селекты после удаления клиента
}

function deleteWorkout(index) {
  const workouts = getWorkouts();
  const deletedWorkout = workouts[index]; 
  workouts.splice(index, 1);
  saveWorkouts(workouts);

  // Возвращаем средства на баланс, если тренировка была отмечена
  const clients = getClients();
  const clientIndex = clients.findIndex(
    (client) => client.lastName === deletedWorkout.clientName
  );
  
  if (clientIndex !== -1 && clients[clientIndex].paymentType === 'direct') {
    const workoutCost = parseFloat(document.getElementById("workoutCost").value);
    clients[clientIndex].balance += workoutCost;
    saveClients(clients);
    renderClientsTable();
  }

  renderWorkoutsTable();
}

function deletePayment(index) {
  const payments = getPayments();
  const deletedPayment = payments[index];  // Сохраняем удаляемый платеж
  payments.splice(index, 1);
  savePayments(payments);

  // Обновляем баланс клиента:
  const clients = getClients();
  const clientIndex = clients.findIndex(
    (client) => client.lastName === deletedPayment.clientName
  );

  if (clientIndex !== -1) {
    // Вычитаем сумму удаленного платежа из баланса
    clients[clientIndex].balance -= deletedPayment.paymentAmount; 
    saveClients(clients);
    renderClientsTable();
  }

  renderPaymentsTable();
}

// Обработчики событий
addClientBtn.addEventListener("click", () => {
  addClientPopup.style.display = "block";
});
addClientForm.addEventListener("submit", addClient);

addWorkoutBtn.addEventListener("click", () => {
  addWorkoutPopup.style.display = "block";
});
addWorkoutForm.addEventListener("submit", addWorkout);

addPaymentBtn.addEventListener("click", () => {
  addPaymentPopup.style.display = "block";
});
addPaymentForm.addEventListener("submit", addPayment);

// Инициализация
renderClientsTable();
updateClientSelects();
renderWorkoutsTable();
renderPaymentsTable();