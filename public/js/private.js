const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const userList = document.getElementById('users');
const roomName = document.getElementById('room-name');

const {
    username,
    room,
    password
} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

const socket = io();

socket.emit('joinPrivateRoom', {
    username,
    room,
    password
});

socket.on('roomUsers', ({
    room,
    users
}) => {
    outputRoomName(room);
    outputUsers(users);
})

socket.on('message', message => {
    outputMessage(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = e.target.elements.msg.value;
    socket.emit('privateMessage', msg);
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
})

const outputMessage = (message) => {
    const container = document.createElement('div');
    container.classList.add('message-container');
    if (message.myMsg) {
        container.classList.add('active');
    }
    const div = document.createElement('div');
    div.classList.add('message');
    const p = document.createElement('p');
    p.classList.add('meta');
    p.innerText = message.username;
    p.innerHTML += `<span>${message.time}</span>`;
    div.appendChild(p);
    const para = document.createElement('p');
    para.classList.add('text');
    para.innerText = message.text;
    div.appendChild(para);
    container.appendChild(div);
    document.querySelector('.chat-messages').appendChild(container);
}

const outputRoomName = (room) => {
    roomName.innerText = room;
}

const outputUsers = (users) => {
    userList.innerHTML = '';
    users.forEach((user) => {
        const li = document.createElement('li');
        li.innerText = user.username;
        userList.appendChild(li);
    });
}

document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
    if (leaveRoom) {
        window.location = '../index.html';
    }
});