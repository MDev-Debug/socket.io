const socket = io("http://localhost:3000");

const urlSearch = new URLSearchParams(window.location.search);
const username = urlSearch.get("username");
const room = urlSearch.get("select_room");

const usernameDiv = document.getElementById('username')
usernameDiv.innerHTML = `Olá ${username} você está na sala ${room}`
socket.emit("selected_room", {
  username,
  room,
}, (messages) => {
    messages.forEach((m) => createMessage(m));
});

document
  .getElementById("message_input")
  .addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      const message = event.target.value;

      const data = {
        room,
        message,
        username,
      };

      socket.emit("send_message", data);
      event.target.value = "";
    }
  });

socket.on("send_message", (data) => {
    createMessage(data)
});

function createMessage(data) {
    const messageDiv = document.getElementById("messages");

    messageDiv.innerHTML += `
          <div class="new_message">
              <label class="form-label">
                  <strong>${data.username}</strong>
                      <span>${data.text} - 
                      ${dayjs(data.createdAt)
                          .format("DD/MM HH:mm")}</span>
              </label>
          </div>
  
      `;
}

document.getElementById('logout')
.addEventListener('click', (event) => {
    window.location.href = "index.html";
})