const config = require('../../../config')
const api = require(config.ports.webserver);

const server = {
    start: async (prms) => await api.start(({routes: prms.routes, port: prms.port})),
    stop: api.stop
};

module.exports = server;