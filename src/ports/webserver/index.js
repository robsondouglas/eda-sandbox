const api = require('./node-express');//require('./fastify');

const server = {
    start: async (prms) => await api.start(({routes: prms.routes, port: prms.port})),
    stop: api.stop
};

module.exports = server;