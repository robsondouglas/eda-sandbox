const ws = require('./socket-io');

const WS = {
    open:   ws.open,
    close:  ws.close,
    on:     ws.on,
    send:   ws.send
}

module.exports = WS;