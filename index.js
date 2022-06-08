const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
require('dotenv').config();

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

const PORT = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, 'public')));

const botUser = 'AppBot';

io.on('connection', socket => {
    socket.on('joinRoom', ({
        username,
        room
    }) => {
        const user = joinedUser(socket.id, username, room);
        socket.join(user.room);
        socket.emit('message', messageFormat(botUser, `Welcome ${user.username}`,false));
        socket.broadcast.to(user.room).emit('message', messageFormat(botUser, `${user.username} joins the chat`,false));
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })
    socket.on('chatMessage', (msg) => {
        const user = getUser(socket.id);
        io.to(socket.id).emit('message', messageFormat(user.username, msg,true));
        socket.broadcast.to(user.room).emit('message', messageFormat(user.username, msg,false));
    })
    socket.on('disconnect', () => {
        const user = userLeaves(socket.id);
        if (user) {
            io.to(user.room).emit('message', messageFormat(botUser, `${user.username} left the chat`,false));
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }
    })
})

server.listen(PORT, () => console.log(`Server running at port ${PORT}`));