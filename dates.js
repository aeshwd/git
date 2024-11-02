const playerList = document.getElementById("playerList");
const storedPlayers = JSON.parse(localStorage.getItem("players")) || [];
const adminPassword = "your_password_here"; // Replace with your chosen password

// Load players from local storage and display them on page load
document.addEventListener("DOMContentLoaded", () => {
    updatePlayerList();
});

// Function to prompt for password before adding a player
function attemptAddPlayer() {
    const password = prompt("Enter the password to add a player:");
    if (password === adminPassword) {
        addPlayer();
    } else {
        alert("Incorrect password. You cannot add a player.");
    }
}

// Function to add a new player
function addPlayer() {
    const playerName = document.getElementById("playerName").value;
    const admissionDate = document.getElementById("admissionDate").value;
    const fees = document.getElementById("fees").value;
    const status = document.getElementById("status").value;

    if (playerName && admissionDate && fees) {
        const newPlayer = { playerName, admissionDate, fees, status };
        storedPlayers.push(newPlayer);
        localStorage.setItem("players", JSON.stringify(storedPlayers));
        displayPlayer(newPlayer);
        document.getElementById("playerForm").reset();
    }
}

// Function to display a single player on the page
function displayPlayer(player) {
    const playerDiv = document.createElement("div");
    playerDiv.classList.add("player-item");

    playerDiv.innerHTML = `
        <div>
            <h3>${player.playerName}</h3>
            <p>Admission Date: ${player.admissionDate}</p>
            <p>Fees: $${player.fees}</p>
            <p>Status: <span class="status">${player.status}</span></p>
        </div>
        <button class="edit-btn" onclick="attemptEditStatus('${player.playerName}')">Edit Status</button>
    `;

    playerList.appendChild(playerDiv);
}

// Function to prompt for password before editing a player's status
function attemptEditStatus(playerName) {
    const password = prompt("Enter the password to edit the status:");
    if (password === adminPassword) {
        editStatus(playerName);
    } else {
        alert("Incorrect password. You cannot edit the player status.");
    }
}

// Function to change the status of a player
function editStatus(playerName) {
    const playerIndex = storedPlayers.findIndex(p => p.playerName === playerName);
    if (playerIndex !== -1) {
        const newStatus = storedPlayers[playerIndex].status === "Active" ? "Inactive" : "Active";
        storedPlayers[playerIndex].status = newStatus;
        localStorage.setItem("players", JSON.stringify(storedPlayers));
        updatePlayerList();
    }
}

// Function to clear and reload the player list from local storage
function updatePlayerList() {
    playerList.innerHTML = "";
    storedPlayers.forEach(player => displayPlayer(player));
}
