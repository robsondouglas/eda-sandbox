const dotenv  = require('dotenv');
dotenv.config();

const {describe, expect, it } = require('@jest/globals')
const queueAdp  = require('../src/adapters/queue/index');
const queuePort = require('../src/ports/queue/index');

const queueName = "FILA-TESTE-001";
const qtdMsgs   = 3; 
const msgs      = Array.from({length: qtdMsgs})
                            .map((itm, idx) => ({
                                id:idx, 
                                nome: `Mensagem ${idx+1}`,
                                moment: (new Date()).valueOf()
                            }));

jest.setTimeout(10000)                            

describe('QUEUE - FLUXO PRINCIPAL', ()=>{
    
    describe('ENVIO DE MENSAGENS', ()=>{
        it('ABRINDO A CONEXÃO COM O ADAPTER', ()=>queueAdp.open(), 3000)
        
        let sendeds = 0;
        
        describe.each(msgs)('ENVIANDO MENSAGEM $nome', (msg)=> {
            it('ENVIANDO', async()=>{
                await queueAdp.send(queueName, msg);
                sendeds++;
            }, 1000)
        });
        it('QUANTIDADE ENVIADAS X TOTAL DE MENSAGENS', ()=> {
            expect(sendeds).toBe(qtdMsgs)
        });

        it('FECHANDO A CONEXÃO COM O ADAPTER', ()=>queueAdp.close(), 1000)
        
    })
    
    
    describe('RECEBIMENTO DE MENSAGENS', ()=>{
        it('ABRINDO A CONEXÃO COM O PORT', async ()=> await queuePort.open(), 3000)

        let receiveds = [];

        it("MENSAGENS RECEBIDAS", async ()=> await queuePort.receive(queueName, rcv => receiveds.push(JSON.parse(rcv)) ), 5000)

        it('QUANTIDADE RECEBIDAS X TOTAL DE MENSAGENS', ()=> {
            expect(receiveds.length).toBe(qtdMsgs)
        });

        it('MENSAGEM NA LISTA DE ENVIO', () => {
            for(let itm of receiveds)
            { expect(itm).toMatchObject( msgs.find( f=> f.id === itm.id ) ) }
        })

        it('FECHANDO A CONEXÃO COM O PORT', ()=> queuePort.close())
    });
});


