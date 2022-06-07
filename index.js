const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const messageFormat = require('./utils/messages');
const {
    getUser,
    joinedUser,
    userLeaves,
    getRoomUsers
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = 3000 || process.env.PORT;
app.use(express.static(path.join(__dirname, 'public')));

const botUser = 'AppBot';

io.on('connection', socket => {
    socket.on('joinRoom', ({
        username,
        room
    }) => {
        const user = joinedUser(socket.id, username, room);
        socket.join(user.room);
        socket.emit('message', messageFormat(botUser, `Welcome ${user.username}`));
        socket.broadcast.to(user.room).emit('message', messageFormat(botUser, `${user.username} joins the chat`));
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })
    socket.on('chatMessage', (msg) => {
        const user = getUser(socket.id);
        io.to(user.room).emit('message', messageFormat(user.username, msg));
    })
    socket.on('disconnect', () => {
        const user = userLeaves(socket.id);
        if (user) {
            io.to(user.room).emit('message', messageFormat(botUser, `${user.username} left the chat`));
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }
    })
})

server.listen(PORT, () => console.log(`Server running at port ${PORT}`));