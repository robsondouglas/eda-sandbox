module.exports = {
    adapters: {
        bdKeyValue: ['./membd'] [0],
        log: ['./console', './console-upper'][1],
        pubsub: ['./kafka', './pusher'][0],
        queue: ['./rabbitmq'][0],
        websocket: ['./socket-io', './pusher'][0],
    },
    ports:{
        pubsub:    ['./kafka', './pusher'][0],
        queue:     ['./rabbitmq'][0],
        webserver: ['./node-express', './fastify'][0],
        websocket: ['./socket-io', './pusher'][0],
    }
}