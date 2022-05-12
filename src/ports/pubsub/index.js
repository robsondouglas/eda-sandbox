const pubsub = require('./kafka')

const Pubsub = {
    open:           pubsub.open,
    subscribe:      pubsub.subscribe,
    unsubscribe:    pubsub.unsubscribe,
    close:          pubsub.close
}

module.exports = Pubsub;