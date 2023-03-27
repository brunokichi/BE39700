const socket = io();

const chatsList = document.getElementById("chats-list");
const chatUser = document.getElementById("chat-user");
const chatMessage = document.getElementById("chat-message");
const chatButton = document.getElementById("chat-send");
const chatState = document.getElementById("chat-state");

chatButton.addEventListener("click", function (ev) {
  const validEmail=/^([\da-z_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
	
  if (!chatUser.value || !chatMessage.value) {
    chatState.innerText = "Error! Algún campo esta incompleto";
  } else if (!validEmail.exec(chatUser.value)) {
		chatState.innerText = "Error! El formato del campo email es incorrecto";
	} else {
    socket.emit("chat-message", chatUser.value, chatMessage.value );
    chatMessage.value = "";
    chatState.innerText = "Mensaje enviado!";
  }
  
});

socket.on("chats", (data) => {
  chatsList.innerHTML = "";

  for (const el of data) {
    const li = document.createElement("li");
    li.innerText = `${el.user}: ${el.message}`;
    chatsList.appendChild(li);
  }
});
