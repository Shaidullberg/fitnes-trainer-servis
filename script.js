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
    }
}

// Функция для закрытия попапов
function closePopups() {
    document.getElementById('popupsContainer').style.display = 'none';
    document.querySelector('.popups').style.display = 'none'; //  добавлено для скрытия .popups
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


        if (clientIndex !== -1) {
            const workoutCost = parseFloat(workoutCostInput.value);
            if (isNaN(workoutCost)) {
                alert("Введите корректную стоимость тренировки");
                return;
            }
            if (clients[clientIndex].paymentType === 'direct') {
                clients[clientIndex].balance += (workout.completed ? -workoutCost : workoutCost);
                saveClients(clients);
                renderClientsTable();
            }
        }
    }


    renderWorkoutsTable();
}


// Функции для работы с платежами
function addPayment(event) {
    event.preventDefault();

    const paymentAmount = parseFloat(document.getElementById("paymentAmount").value);
    if (isNaN(paymentAmount)) {
        alert("Введите корректную сумму платежа.");
        return;
    }

    const payments = getPayments();
    const newPayment = {
        id: Date.now(),
        clientName: document.getElementById("paymentClient").value,
        paymentDate: document.getElementById("paymentDate").value,
        paymentType: document.getElementById("paymentTypeAdd").value,
        paymentAmount: paymentAmount
    };
    payments.push(newPayment);
    savePayments(payments);

    updateClientBalance(newPayment.clientName, newPayment.paymentAmount, newPayment.paymentType, "add");

    renderPaymentsTable();
    addPaymentForm.reset();
    closePopups();
}


function renderPaymentsTable() {
    paymentTable.innerHTML = "";
    const payments = getPayments();

    payments.forEach((payment) => {
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
            if (confirm("Вы уверены, что хотите удалить этот платёж?")) {
                deletePayment(payment.id);
            }
        });
        deleteCell.appendChild(deleteBtn);

    });
}

// Функция для обновления баланса клиента
function updateClientBalance(clientName, amount, paymentType, operation) {
    const clients = getClients();
    const clientIndex = clients.findIndex(client => client.lastName === clientName);

    if (clientIndex !== -1) {
        if (paymentType === "direct") {
            if (operation === "add") {
                clients[clientIndex].balance += amount;
            } else if (operation === "subtract") {
                clients[clientIndex].balance -= amount;
            }
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

        renderWorkoutsTable();
    }
}



function deletePayment(paymentId) {
    const payments = getPayments();
    const paymentIndex = payments.findIndex(payment => payment.id === paymentId);


    if (paymentIndex !== -1) {
        const deletedPayment = payments[paymentIndex];
        payments.splice(paymentIndex, 1);
        savePayments(payments);


        updateClientBalance(deletedPayment.clientName, deletedPayment.paymentAmount, deletedPayment.paymentType, "subtract");
        renderPaymentsTable();
    }
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
while (popups.firstChild) {
    popupsContainer.appendChild(popups.firstChild);
}

// Удаляем дублирующуюся кнопку "Отмена"
const cancelButtons = addClientPopup.querySelectorAll("button[onclick='closePopups()']");
if (cancelButtons.length > 1) {
    cancelButtons[1].remove();
}