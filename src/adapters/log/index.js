const { readStringFlag } = require('../../ff');

const getAdapter = async() =>{
    return require(await readStringFlag('adapter-log', 'console'));
}

const Log = {
    log :  async (msg, ...msgs)=> (await getAdapter()).log(msg, msgs),
    warn:  async (msg, ...msgs)=> (await getAdapter()).warn(msg, msgs),
    error: async (msg, ...msgs)=> (await getAdapter()).error(msg, msgs),
    info:  async (msg, ...msgs)=> (await getAdapter()).info(msg, msgs),
}

module.exports = Log;