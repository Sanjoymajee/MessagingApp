const moment = require('moment');
const messageFormat = (username,text,myMsg) => {
    return {
        username,
        text,
        myMsg,
        time: moment().format('h:mm a')
    }
}

module.exports = messageFormat;