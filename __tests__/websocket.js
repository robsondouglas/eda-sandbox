const dotenv  = require('dotenv');
dotenv.config();
const {describe, expect, it, beforeAll, afterAll } = require('@jest/globals')

const wsPort = require('../src/ports/websocket');
const wsAdpt = require('../src/adapters/websocket');

const expected = {
    CLIENT_SERVER_EVENT_NAME:       'EVT001',
    SERVER_CLIENT_EVENT_NAME:       'EVT002',
    SERVER_CLIENT_PVT_EVENT_NAME:   'EVT003',
    CLI001:                         'CLI001',
    CLI002:                         'CLI002'
};

const testPort = 3001;
const testUrl  = `ws://localhost:${testPort}`;

jest.setTimeout(10000);

let msgsCliServ = [];
let clients = [];

const wait = (timeout) => new Promise(resolve => setInterval(resolve, timeout));

beforeAll(()=> {
    let events = [
        {
            event: expected.CLIENT_SERVER_EVENT_NAME, 
            delegate: (id, msg)=> msgsCliServ.push(msg)
        }
    ];

    wsPort.start({
        events: events, 
        port:   testPort, 
        onConnect: (id) =>   clients.push(id), 
        onDisconnect: (id)=> clients.splice( 0, 1) 
    });    
});

const connecteds = clients.length;

it('Conexão de clientes', async ()=>{    
    await wsAdpt.open({connName: expected.CLI001, url: testUrl});
    expect(clients.length).toBe(connecteds+1);

});

it('Mensagem cliente->servidor', async()=>{
    const msg = 'abc-123';

    wsAdpt.send({connName: expected.CLI001, eventName: expected.CLIENT_SERVER_EVENT_NAME, msg: msg});
    await wait(50);
    expect(msgsCliServ[0]).toBe(msg); 
});

it('Mensagem servidor->cliente', async()=>{
    const msg = 'fgh-456';
    
    let msgRecebida = '';
    wsAdpt.on(expected.CLI001, expected.SERVER_CLIENT_EVENT_NAME, (msg)=> [msgRecebida] = msg)
    
    await wsPort.send({port: testPort, event: expected.SERVER_CLIENT_EVENT_NAME, msg: msg});
    await wait(50);

    expect(msgRecebida).toBe(msg);
    
})

it('Mensagem privada para o cliente', async()=>{
    const msg = 'ijk-789';
    const cli2Id = await wsAdpt.open({connName: expected.CLI002, url: testUrl});
    
    let msgRecebida1 = '';
    let msgRecebida2 = '';
    
    wsAdpt.on(expected.CLI001, expected.SERVER_CLIENT_PVT_EVENT_NAME, (msg)=> [msgRecebida1] = msg)
    wsAdpt.on(expected.CLI002, expected.SERVER_CLIENT_PVT_EVENT_NAME, (msg)=> [msgRecebida2] = msg)
    
    await wsPort.send({port: testPort, event: expected.SERVER_CLIENT_PVT_EVENT_NAME, destins:[cli2Id], msg: msg});
    await wait(50);

    expect(msgRecebida1).not.toBe(msg);
    expect(msgRecebida2).toBe(msg);
    
});

it('Desconexão de clientes', async()=>{
    await wsAdpt.close(expected.CLI002);
    await wsAdpt.close(expected.CLI001);
    await wait(50);
    expect(clients.length).toBe(connecteds);    
});

afterAll(()=> wsPort.close(testPort))
