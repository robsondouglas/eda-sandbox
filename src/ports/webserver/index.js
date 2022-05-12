const api = require('./node-express');
const server = {
    start: api.start,
    stop: api.stop
};

module.exports = server;