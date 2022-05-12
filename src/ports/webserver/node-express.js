const Log       = require('../../adapters/log');
const _express  = require('../../utils/express');

const server = {
    start: _express.start,
    stop:  _express.stop   
}

module.exports = server;