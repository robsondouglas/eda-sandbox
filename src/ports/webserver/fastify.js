const Log       = require('../../adapters/log');
const _fastify  = require('../../utils/fastify');

const server = {
    start: _fastify.start,
    stop:  _fastify.stop   
}

module.exports = server;