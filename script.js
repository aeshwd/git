// script.js

let currentYear = new Date().getFullYear();
let selectedMonth = new Date().getMonth(); // Set the default to the current month

// Month names for display
const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

let accessGranted = false; // Global variable to track access
const correctPassword = "ffba1120"; // Change this to your preferred password here

// Update the display for current month and year
function updateYearDisplay() {
    document.getElementById("currentYearDisplay").textContent = currentYear;
    loadPlayers();
}

// Change month selection
function changeMonth() {
    const monthDropdown = document.getElementById("monthDropdown");
    selectedMonth = parseInt(monthDropdown.value); // Update the selected month
    loadPlayers();
}

// Change to the previous year
function prevYear() {
    currentYear -= 1;
    updateYearDisplay();
}

// Change to the next year
function nextYear() {
    currentYear += 1;
    updateYearDisplay();
}

// Show password modal for access
function showPasswordModal(actionCallback) {
    document.getElementById("passwordModal").style.display = "flex";
    document.getElementById("passwordError").textContent = ""; // Clear any previous errors

    // Set the callback to be called after successful password validation
    document.getElementById("submitPassword").onclick = function () {
        validatePassword(actionCallback);
    };
}

// Function to validate the entered password
function validatePassword(actionCallback) {
    const inputPassword = document.getElementById("accessPassword").value;
    if (inputPassword === correctPassword) {
        accessGranted = true;
        document.getElementById("passwordModal").style.display = "none";
        actionCallback(); // Call the action callback after password validation
    } else {
        document.getElementById("passwordError").textContent = "Incorrect Password. Try again.";
    }
}

// Add a new player with details and save to localStorage
function addPlayer(event) {
    event.preventDefault(); // Prevent form submission
    if (!accessGranted) {
        showPasswordModal(() => addPlayerAction());
    } else {
        addPlayerAction();
    }
}

function addPlayerAction() {
    const player = {
        name: document.getElementById("playerName").value,
        fees: document.getElementById("fees").value,
        status: "unpaid"
    };
    savePlayer(player);
    document.getElementById("playerForm").reset();
    loadPlayers();
}

// Save a player to localStorage under the specific month-year key
function savePlayer(player) {
    const monthYearKey = `${monthNames[selectedMonth]}-${currentYear}`;
    const players = JSON.parse(localStorage.getItem(monthYearKey)) || [];
    players.push(player);
    localStorage.setItem(monthYearKey, JSON.stringify(players));
}

// Load players from localStorage for the current month and year
function loadPlayers() {
    const monthYearKey = `${monthNames[selectedMonth]}-${currentYear}`;
    const players = JSON.parse(localStorage.getItem(monthYearKey)) || [];
    const playerCards = document.getElementById("playerCards");
    playerCards.innerHTML = ''; // Clear current list

    players.forEach((player, index) => {
        const card = document.createElement("div");
        card.classList.add("player-card");
        card.innerHTML = `
            <span>${player.name}</span>
            <span>Rs. ${player.fees}</span>
            <span class="status-icon" onclick="toggleStatus(${index})">
                ${player.status === "paid" ? "✅" : "❌"}
            </span>

            
            
            <button class="delete" onclick="deletePlayer(${index})" style="background-color: #ff5252;">Delete</button>
        `;
        playerCards.appendChild(card);
    });
}

// Toggle the fee status between "paid" and "unpaid"
function toggleStatus(index) {
    const monthYearKey = `${monthNames[selectedMonth]}-${currentYear}`;
    const players = JSON.parse(localStorage.getItem(monthYearKey)) || [];
    players[index].status = players[index].status === "paid" ? "unpaid" : "paid";
    localStorage.setItem(monthYearKey, JSON.stringify(players));
    loadPlayers();
}

// Edit a player's details
function editPlayer(index) {
    if (!accessGranted) {
        showPasswordModal(() => editPlayerAction(index));
    } else {
        editPlayerAction(index);
    }
}

// Actual edit player action, called only if access is granted
function editPlayerAction(index) {
    const monthYearKey = `${monthNames[selectedMonth]}-${currentYear}`;
    const players = JSON.parse(localStorage.getItem(monthYearKey)) || [];
    const player = players[index];

    // Populate the form with existing data for editing
    document.getElementById("playerName").value = player.name;
    document.getElementById("fees").value = player.fees;

    // Remove the player from list temporarily
    players.splice(index, 1);
    localStorage.setItem(monthYearKey, JSON.stringify(players));

    loadPlayers(); // Reload to reflect removal
}

// Delete a player from the list
function deletePlayer(index) {
    if (!accessGranted) {
        showPasswordModal(() => deletePlayerAction(index));
    } else {
        deletePlayerAction(index);
    }
}

function deletePlayerAction(index) {
    const monthYearKey = `${monthNames[selectedMonth]}-${currentYear}`;
    const players = JSON.parse(localStorage.getItem(monthYearKey)) || [];
    players.splice(index, 1);
    localStorage.setItem(monthYearKey, JSON.stringify(players));
    loadPlayers();
}

updateYearDisplay();
