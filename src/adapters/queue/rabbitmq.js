const RabbitMQ = require("../../utils/rabbitmq");

const RabbitMQAdapter = {
    open : ()                   => RabbitMQ.open(process.env.QUEUE_URL),
    send : ( queueName, msg )   => RabbitMQ.send(process.env.QUEUE_URL, queueName, msg),
    close: ()                   => RabbitMQ.close(process.env.QUEUE_URL)
}

module.exports = RabbitMQAdapter;