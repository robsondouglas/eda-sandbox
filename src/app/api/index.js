const dotenv = require('dotenv')
const {randomUUID} = require('crypto');
dotenv.config();

const apiPort   = require('../../ports/webserver/index');
const queueAdpt = require('../../adapters/queue/index');
const Log       = require('../../adapters/log');
const bdAdpt    = require('../../adapters/bd-keyvalue/index')
    
async function init(){
    await queueAdpt.open();

    let opcoes = [
        {id: '1', nome: 'vermelho', cor: '#ff0000'},
        {id: '2', nome: 'amarelo', cor: '#ffff00'},
        {id: '3', nome: 'verde', cor: '#00ff00'},
        {id: '4', nome: 'azul', cor: '#0000ff'}        
    ]

    const routes = [
        {
            method: 'GET',
            path: '/opcoes',
            delegate:  async()=>({status:200, body: JSON.stringify(opcoes)})
        },
        { 
            method: 'POST',  
            path:'/vote',  
            delegate: async({body}) => {
                Log.log('Votando', body)                        
                let itm = opcoes.find( f=> f.id === body.id )
                if(itm)
                {
                    try{
                        let evt = { 
                            id: randomUUID(), 
                            data: itm,
                            timestamp: (new Date()).valueOf() 
                        }

                        await queueAdpt.send('VOTE', evt)

                        Log.log('Voto salvo', evt)
                        return {status:201, body: ''}
                    }
                    catch(ex){
                        Log.error('Erro ao registrar voto', ex)
                        return {status:500, body: ex}
                    }
                }
                else 
                { return {status: 500, body: 'Voto inválido'} }
            }
        },

        {
            method: 'GET',
            path: '/votes/:entity/:key',
            delegate: async()=>{

                

                return {
                    status: 200,
                    body: JSON.stringify( bdAdpt.get('all', 'all') )
                }
            }
        }
    ];
    
    const port = process.env.PORT_NUMBER 
    
    Log.log('INICIANDO VOTE:', port)
    apiPort.start({routes: routes, port: port});

    
}

init()