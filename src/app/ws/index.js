const dotenv = require('dotenv')
dotenv.config();

const wsServer = require('../../ports/websocket/index');

async function init(){
    const clients = []
    let events = [
        {
            event: 'QTD_NOTIFICATION', 
            delegate: async(id, msg)=> {
                console.log('QTD_NOTIFICATION', msg)
                await wsServer.send({port: process.env.WSPORT, event: 'QTD_CHANGED', msg: msg})
            }
        }
    ];

    const OnConnect = async(id)=>{
        // clients.push(id)
        // console.log(clients)
        // await wsServer.send({port: process.env.WSPORT, event: 'USERS_CONNECTEDS', msg: clients.length.toString()})
    }

    const OnDisconnect = async(id)=>{
        // console.log(clients)
        // if(clients.length>0)
        // {clients.splice( clients.findIndex(id), 1) }
        // await wsServer.send({port: process.env.WSPORT, event: 'USERS_CONNECTEDS', msg: clients.length.toString()})
    }

    console.log('INICIANDO SERVIDOR WEBSOCKET', process.env.WSPORT)
    wsServer.start({
        events: events, 
        port:   process.env.WSPORT, 
        onConnect: OnConnect, 
        onDisconnect: OnDisconnect 
    }); 
}

init()
