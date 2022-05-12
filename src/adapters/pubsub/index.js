const pubsub = require('./kafka')

const Pubsub = {
    open: pubsub.open,
    send: pubsub.send,
    close: pubsub.close
}

module.exports = Pubsub;