const RabbitMQ = require("../../utils/rabbitmq");

const queueUrl = process.env.QUEUE_URL
const RabbitMQAdapter = {
    open : ()                   => RabbitMQ.open(queueUrl),
    send : ( queueName, msg )   => RabbitMQ.send(queueUrl, queueName, msg),
    close: ()                   => RabbitMQ.close(queueUrl)
}

module.exports = RabbitMQAdapter;