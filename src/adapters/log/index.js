const logAdapter = require('./console');
const allow = process.env.WRITE_LOG === '1';
const Log = {
    log :  (msg, ...msgs)=> allow && logAdapter.log(msg, msgs),
    warn:  (msg, ...msgs)=> allow && logAdapter.warn(msg, msgs),
    error: (msg, ...msgs)=> allow && logAdapter.error(msg, msgs),
    info:  (msg, ...msgs)=> allow && logAdapter.info(msg, msgs),
}

module.exports = Log;