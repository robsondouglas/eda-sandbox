const dotenv = require('dotenv')
dotenv.config();

const wsServer = require('../../ports/websocket/index');
const Log       = require('../../adapters/log');

async function init(){
    const clients = []
    const port = process.env.PORT_NUMBER 
    
    let events = [
        {
            event: 'QTD_NOTIFICATION', 
            delegate: async(id, msg)=> {
                Log.log('QTD_NOTIFICATION', msg)
                await wsServer.send({port: port, event: 'QTD_CHANGED', msg: msg})
            }
        }
    ];

    const OnConnect = async(id)=>{
        Log.log('connected', id)
    }

    const OnDisconnect = async(id)=>{
        Log.log('disconnected', id)
    }
    
    Log.log('INICIANDO SERVIDOR WEBSOCKET', port)
    wsServer.start({
        events: events, 
        port:   port, 
        onConnect: OnConnect, 
        onDisconnect: OnDisconnect 
    }); 
}

init()
