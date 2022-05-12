const dotenv  = require('dotenv');
dotenv.config();
const {describe, expect, it, beforeAll, afterAll } = require('@jest/globals')
const {wait} = require('../src/utils/tools');

const psPort = require('../src/ports/pubsub/index');
const psAdpt = require('../src/adapters/pubsub/index');

const expected = {
    CONN1: 'CLI1',
    CONN2: 'CLI2',
    CONN3: 'SRV1',
    TOPICO1: 'TOPICO1',    
    TOPICO2: 'TOPICO2',    
    MENSAGEM1: 'TESTE001',
    MENSAGEM2: 'TESTE002'

};

jest.setTimeout(10000);



beforeAll(async ()=>{  
    await psAdpt.open(expected.CONN3);    
    await psPort.open(expected.CONN1)
})

it('Envio de mensagem', async()=>{
    let msgs1 = []
    let msgs2 = []

    setInterval(async()=>{
        await expect(psAdpt.send(expected.CONN3, expected.TOPICO1, expected.MENSAGEM1)).resolves.not.toThrow()

        await expect(psPort.subscribe({connName: expected.CONN1, channel: expected.TOPICO1, events: (msg)=> msgs1.push(msg) })).resolves.not.toThrow()
        await expect(psPort.subscribe({connName: expected.CONN1, channel: expected.TOPICO2, events: (msg)=> msgs2.push(msg) })).resolves.not.toThrow()

        await expect(psAdpt.send(expected.CONN3, expected.TOPICO2, expected.MENSAGEM2)).resolves.not.toThrow()

    }, 0)
    
    await wait(5000)

    await expect(psPort.close(expected.CONN1)).resolves.not.toThrow()
    await expect(psPort.close(expected.CONN1)).resolves.not.toThrow()
    await expect(psAdpt.close(expected.CONN1)).resolves.not.toThrow()
});


