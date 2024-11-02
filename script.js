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
const workoutCostInput = document.getElementById("workoutCost");

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
    closePopups();
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

        const deleteCell = newRow.insertCell();
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "X";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.addEventListener("click", () => {
            if (confirm("Вы уверены, что хотите удалить этого клиента?")) {
                deleteClient(index);
            }
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


// Функция для отображения попапов
function showPopup(popupId) {
    document.getElementById('popupsContainer').style.display = 'block';
    const popups = document.querySelectorAll('.popup');
    popups.forEach(popup => popup.style.display = 'none');

    const popup = document.getElementById(popupId);
    if (popup) {
        popup.style.display = 'block';
        document.querySelector('.popups').style.display = 'block';
    }
}

// Функция для закрытия попапов
function closePopups() {
    document.getElementById('popupsContainer').style.display = 'none';
    document.querySelector('.popups').style.display = 'none';
    const popups = document.querySelectorAll('.popup');
    popups.forEach(popup => popup.style.display = 'none');
}



// Функции для работы с тренировками
function addWorkout(event) {
    event.preventDefault();

    const clientName = document.getElementById("workoutClient").value;
    const workoutDate = document.getElementById("workoutDate").value;
    const workoutTime = document.getElementById("workoutTime").value;

    const workouts = getWorkouts();
    const newWorkout = {
        id: Date.now(),
        clientName,
        workoutDate,
        workoutTime,
        completed: false
    };
    workouts.push(newWorkout);
    saveWorkouts(workouts);

    renderWorkoutsTable();
    addWorkoutForm.reset();
    closePopups();
}

function renderWorkoutsTable() {
    workoutTable.innerHTML = "";
    const workouts = getWorkouts();

    workouts.forEach((workout) => {
        const newRow = workoutTable.insertRow();
        newRow.insertCell().textContent = workout.workoutDate;
        newRow.insertCell().textContent = workout.workoutTime;
        newRow.insertCell().textContent = workout.clientName;

        const completedCell = newRow.insertCell();
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = workout.completed;
        checkbox.addEventListener("change", () => {
            toggleWorkoutCompletion(workout.id);
        });
        completedCell.appendChild(checkbox);

        const deleteCell = newRow.insertCell();
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "X";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.addEventListener("click", () => {
            if (confirm("Вы уверены, что хотите удалить эту тренировку?")) {
                deleteWorkout(workout.id);
            }
        });
        deleteCell.appendChild(deleteBtn);


    });
}

function toggleWorkoutCompletion(workoutId) {
    const workouts = getWorkouts();
    const workoutIndex = workouts.findIndex(workout => workout.id === workoutId);

    if (workoutIndex !== -1) {
        const workout = workouts[workoutIndex];
        workout.completed = !workout.completed;
        saveWorkouts(workouts);

        const clients = getClients();
        const clientIndex = clients.findIndex(client => client.lastName === workout.clientName);

        if (clientIndex !== -1 && clients[clientIndex].paymentType === 'direct') {
            const workoutCost = parseFloat(workoutCostInput.value) || 0;
            clients[clientIndex].balance += (workout.completed ? -workoutCost : workoutCost);
            saveClients(clients);
            renderClientsTable();
        }
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

    const payments = getPayments();
    const newPayment = {
        clientName,
        paymentDate,
        paymentType,
        paymentAmount,
    };
    payments.push(newPayment);
    savePayments(payments);

    updateClientBalance(clientName, paymentAmount, "add");

    renderPaymentsTable();
    addPaymentForm.reset();
    closePopups();
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


        const deleteCell = newRow.insertCell();
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "X";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.addEventListener("click", () => {
            if (confirm("Вы уверены, что хотите удалить этот платеж?")) {
                deletePayment(index);
            }
        });
        deleteCell.appendChild(deleteBtn);
    });
}

// Функция для обновления баланса клиента
function updateClientBalance(clientName, amount, operation) {
    const clients = getClients();
    const clientIndex = clients.findIndex(client => client.lastName === clientName);

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
    const deletedClient = clients[index];
    clients.splice(index, 1);
    saveClients(clients);
    renderClientsTable();
    updateClientSelects();


      // Удаляем тренировки и платежи удаленного клиента
      const workouts = getWorkouts().filter(workout => workout.clientName !== deletedClient.lastName);
      saveWorkouts(workouts);
      renderWorkoutsTable();

      const payments = getPayments().filter(payment => payment.clientName !== deletedClient.lastName);
      savePayments(payments);
      renderPaymentsTable();
}



function deleteWorkout(workoutId) {
    const workouts = getWorkouts();
    const workoutIndex = workouts.findIndex(workout => workout.id === workoutId);


    if (workoutIndex !== -1) {
        const deletedWorkout = workouts[workoutIndex];
        workouts.splice(workoutIndex, 1);
        saveWorkouts(workouts);

        if (deletedWorkout.completed) {
            const clients = getClients();
            const clientIndex = clients.findIndex(client => client.lastName === deletedWorkout.clientName);

            if (clientIndex !== -1 && clients[clientIndex].paymentType === "direct") {
                const workoutCost = parseFloat(document.getElementById("workoutCost").value) || 0;
                clients[clientIndex].balance += workoutCost;
                saveClients(clients);
                renderClientsTable();
            }
        }
    }
    renderWorkoutsTable();
}

function deletePayment(index) {
    const payments = getPayments();
    const deletedPayment = payments[index];
    payments.splice(index, 1);
    savePayments(payments);


    const clients = getClients();
    const clientIndex = clients.findIndex(client => client.lastName === deletedPayment.clientName);


    if (clientIndex !== -1) {
        clients[clientIndex].balance -= deletedPayment.paymentAmount;
        saveClients(clients);
        renderClientsTable();
    }


    renderPaymentsTable();
}

// Обработчики событий
addClientBtn.addEventListener("click", () => showPopup('addClientPopup'));
addClientForm.addEventListener("submit", addClient);

addWorkoutBtn.addEventListener("click", () => showPopup('addWorkoutPopup'));
addWorkoutForm.addEventListener("submit", addWorkout);

addPaymentBtn.addEventListener("click", () => showPopup('addPaymentPopup'));
addPaymentForm.addEventListener("submit", addPayment);

// Инициализация
renderClientsTable();
updateClientSelects();
renderWorkoutsTable();
renderPaymentsTable();


// Перемещаем попапы в контейнер
const popupsContainer = document.getElementById('popupsContainer');
const popups = document.querySelector('.popups');

if (popups.firstChild) {
  popupsContainer.appendChild(popups.firstChild);
}