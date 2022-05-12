const RabbitMQ = require("../../utils/rabbitmq");

const RabbitMQPort = {
    open :    ()                        => RabbitMQ.open(process.env.QUEUE_URL),
    receive : ( queueName, callback )   => RabbitMQ.receive(process.env.QUEUE_URL, queueName, callback),
    close:    ()                        => RabbitMQ.close(process.env.QUEUE_URL)
}

module.exports = RabbitMQPort;