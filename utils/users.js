const users = []

const joinedUser = (id, username, room) => {
    const user = {
        id,
        username,
        room
    };
    users.push(user);
    return user;
}

const userLeaves = (id) => {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

const getRoomUsers = (room) => {
    return users.filter(user => user.room === room);
}

const getUser = (id) => {
    return users.find(user => user.id === id);
}

module.exports = {
    joinedUser,
    getUser,
    getRoomUsers,
    userLeaves
}