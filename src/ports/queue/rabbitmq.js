const RabbitMQ = require("../../utils/rabbitmq");
const url = process.env.QUEUE_URL;
const RabbitMQPort = {
    open :    ()                        => RabbitMQ.open(url),
    receive : ( queueName, callback )   => RabbitMQ.receive(url, queueName, callback),
    close:    ()                        => RabbitMQ.close(url)
}

module.exports = RabbitMQPort;