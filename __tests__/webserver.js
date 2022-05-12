const dotenv  = require('dotenv');
dotenv.config();
const {describe, expect, it, beforeAll, afterAll } = require('@jest/globals')
const axios = require('axios').default;

const apiPort = require('../src/ports/webserver');


const expected = {
    items: Array.from({length:3}).map( (itm, idx)=> ({id:idx, nome:`Teste ${idx+1}`}) ),
    path: '/teste',
    newId: -1,
    addName: 'NOVO ITEM INCLUÍDO',
    updName: 'NOME ATUALIZADO',
};

const testPort = 3000;
const testUrl      = `http://localhost:${testPort}`;

jest.setTimeout(10000)

const find = async({params})=>{
    let itm = expected.items.find(f=>f.id === Number.parseInt(params.id));
    return itm ? { status: 200, body: itm } : {status: 204};
}

const insert = async({body})=>{
    const newItem = {id: body.id, nome: body.nome}
    expected.items.push(newItem);
    return { status: 201, body: newItem };
};

const update = async({body})=>{
    let itm = expected.items.find(f=>f.id === body.id);
    itm.nome = body.nome;
    return { status: 200, body: itm };
};

const _delete = async({body})=>{
    let idx = expected.items.findIndex(f=>f.id === body.id);
    expected.items.splice(idx, 1);
    return { status: 200 };
};


beforeAll(()=> {
    const routes = [
        { method: 'GET',    path: expected.path,           delegate: async() => ({ status: 200, body: expected.items })},
        { method: 'GET',    path: `${expected.path}/:id`,  delegate: find },
        { method: 'POST',   path:expected.path,            delegate: insert },
        { method: 'PUT',    path: expected.path,           delegate: update },
        { method: 'DELETE', path: expected.path,           delegate: _delete },
    ];

    apiPort.start({routes: routes, port: testPort});
});

afterAll(()=>  apiPort.stop(testPort))

describe('WEBSERVER - FLUXO PRINCIPAL', ()=>{
    
    describe('OBTENDO DADOS', ()=>{
        it( 'GET', async()=>{
            let res = await axios.get(`${testUrl}${expected.path}`); 
            expect(res.status).toBe(200);
            expect(res.data).toEqual(expected.items);
        });

        it( 'GET/:id', async()=>{
            let itm = expected.items[0];
            let res = await axios.get(`${testUrl}${expected.path}/${itm.id}`); 
            expect(res.status).toBe(200);
            expect(res.data).toEqual(itm);
        });
    })
    
    describe('INCLUSÃO DE DADOS', ()=>{
        it( 'POST', async()=>{
            const newitem = {id: expected.newId, nome : expected.addName};
            let res = await axios.post(`${testUrl}${expected.path}`, newitem); 
            expect(res.status).toBe(201);
            expect(res.data).toEqual(newitem);
        });

        it( 'GET/:id', async()=>{
            let res = await axios.get(`${testUrl}${expected.path}/${expected.newId}`); 
            expect(res.status).toBe(200);
            expect(res.data).toEqual(expected.items.find(f=>f.id === expected.newId));
        });
    });

    describe('ALTERAÇÃO DE DADOS', ()=>{
        it( 'PUT', async()=>{
            const newitem = {id: expected.newId, nome : expected.updName};
            let res = await axios.put(`${testUrl}${expected.path}`, newitem); 
            expect(res.status).toBe(200);
            expect(res.data).toEqual(newitem);
            expect(res.data.nome).toBe(expected.updName);
        });

        it( 'GET/:id', async()=>{
            let res = await axios.get(`${testUrl}${expected.path}/${expected.newId}`); 
            expect(res.status).toBe(200);
            expect(res.data).toEqual(expected.items.find(f=>f.id === expected.newId));
            expect(res.data.nome).toBe(expected.updName);
        });
    });

    describe("EXCLUSÃO DE DADOS", ()=>{
        it('DELETE', async()=>{
            const itm = {id: expected.newId };
            let res = await axios.delete(`${testUrl}${expected.path}`, itm); 
            expect(res.status).toBe(200);            
        });

        it( 'GET/:id', async()=>{
            let res = await axios.get(`${testUrl}${expected.path}/${expected.newId}`); 
            expect(res.status).toBe(204);
        });
    });
});
