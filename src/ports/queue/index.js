const queue = require('./rabbitmq');

const Queue = {
    open:    queue.open,
    receive: queue.receive,
    close:   queue.close
}

module.exports = Queue;