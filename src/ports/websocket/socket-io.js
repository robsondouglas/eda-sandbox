const {Server}      = require('socket.io');
const Log = require('../../adapters/log');

let servers = []

const srv = (port) => servers.find(m=>m.port === port);
const clients = async(port) => await srv(port)?.server.allSockets();

const server = {
    start : ({port, events, onConnect, onDisconnect}) =>{
        Log.log('Iniciando socket.io', port);
        io = new Server(port);
        servers.push({ port: port, server: io, rooms: [] });
        
        io.on('connection', (socket) => {
            onConnect?.( socket.id );
            socket.on('disconnect', () => onDisconnect?.( socket.id ))
            if(events)
            {
                for(let evt of events)
                { socket.on(evt.event, (res)=> evt.delegate(socket.id, res)) }
            }    
        })
        
        

        
    },
    getClients:     clients,
    send:    async({port, destins, event, msg, channels}) => {
        let _srv = srv(port)?.server;
        if(_srv)
        {
            if( !channels && !destins )
            { _srv.emit(event, msg) }
            else
            {
                let chain = channels?.reduce((__srv, itm) => __srv.to(itm),_srv) || _srv;
                    chain = destins?.reduce((__srv, itm) => __srv.to(itm), chain) || _srv;  
                
                chain.emit(event, msg);                
            }
        }
        else
        {
            throw new Error('Nenhum servidor na porta informada');
        }
    },
    createRoom: (port, name) => {
        const _srv = srv(port);
        if(_srv.rooms.findIndex(name) < 0 )
        { rooms.push(name)  }
        else
        { throw new Error('Nome de sala já existente') }
    },
    closeRoom: (port, name) =>{
        let idx = _srv.rooms.findIndex(name);
        if(idx>=0)
        { _srv.rooms.splice(idx, 1); }
    },
    joinRoom : (port, name, ...clientIDs) =>{
        const _srv = srv(port);
        for(let id of clientIDs)
        { _srv.to(id).join(name); }
    },
    leaveRoom : (port, name, ...clientIDs) =>{
        const _srv = srv(port);
        for(let id of clientIDs)
        { _srv.to(id).leave(name); }
    },
    close : async (port)=>{
        let idx = servers.findIndex(f=>f.port === port);
        if(idx>=0){
            Log.log('Encerrando socket.io', port);
            await servers[idx].server.close();
            delete servers[idx];
            servers.splice(idx, 1);
        }
    }
}

module.exports = server;