const queue = require('./rabbitmq');

const Queue = {
    open:  queue.open,
    send:  queue.send,
    close: queue.close
}

module.exports = Queue;