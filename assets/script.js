const socket = io();

document.getElementById("submit-btn").addEventListener("click", () => {
  const name = document.getElementById("username").value;
  const message = document.getElementById("message").value;

  if (!name || !message) {
    alert("Please enter both name and message.");
    return;
  }

  // Emit the chat message to the server
  socket.emit("chat message", { name, message });

  // Display the sent message
  displayMessage(name, message, true);
  document.getElementById("message").value = "";
});

// Display received messages
socket.on("chat message", (data) => {
  displayMessage(data.name, data.message, false);
});

function displayMessage(name, message, isSent) {
  const messageList = document.getElementById("message-list");
  const newMessage = document.createElement("li");

  newMessage.className = isSent ? "sent" : "received";

  if (isSent) {
    newMessage.innerHTML = `<div class="message-content">${message}</div>`;
  } else {
    newMessage.innerHTML = `<div class="message-content">${name}: ${message}</div>`;
  }

  messageList.appendChild(newMessage);
  messageList.scrollTop = messageList.scrollHeight; // Scroll to the bottom
}
