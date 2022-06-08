const moment = require('moment');
const messageFormat = (username,text,myMsg) => {
    return {
        username,
        text,
        myMsg,
        time: moment().utcOffset("+05:30").format('h:mm a')
    }
}

module.exports = messageFormat;