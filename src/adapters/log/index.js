const { readStringFlag } = require('../../ff');
const ConsoleAdapter = require('../../adapters/log/console');

// const getAdapter = async() =>{
//     return require(await readStringFlag('adapter-log', 'console'));
// }

const Log = {
    log :  async (msg, ...msgs)=> (ConsoleAdapter).log(msg, msgs),
    warn:  async (msg, ...msgs)=> (ConsoleAdapter).warn(msg, msgs),
    error: async (msg, ...msgs)=> (ConsoleAdapter).error(msg, msgs),
    info:  async (msg, ...msgs)=> (ConsoleAdapter).info(msg, msgs),
}

module.exports = Log;