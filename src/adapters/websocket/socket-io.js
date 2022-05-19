const {io} = require("socket.io-client");
const Log = require("../log");

let conns = {  };

const client = {
    open:  ({connName, url, onConnect, onDisconnect}) => {
        return new Promise((resolve, reject)=>{
            Log.log('Iniciando socket.io-client', connName, url)
            if(!conns[connName])
            { 
                const cnn = io(url)
                conns[connName] = cnn;
                
                cnn.on('connect', ()=>{
                    onConnect?.(cnn.id);
                    resolve(cnn.id); 
                });

                cnn.on('disconnect', () => onDisconnect?.()) 
            }
            else
            { reject (new Error('Já existe uma conexão websocket com esse nome')) }
        });
    },
    close: (connName) =>  {
        return new Promise((resolve, reject)=>{
            Log.log('Encerrando socket.io-client', connName)            
            
            conns[connName].on('disconnect', ()=>{
                delete conns[connName];
                resolve();
            });
            
            conns[connName].close();
        })
        
    },
    send:  ({connName, msg, eventName}) =>{
        if(msg)
        { eventName ? conns[connName].emit(eventName, msg) : conns[connName].emit(msg) }
        else
        {throw new Error('Mensagem deve ser preenchida')}
    },  
    on : (connName, eventName, delegate) => {
        conns[connName].on(eventName, (...msgs)=>{ delegate(msgs)});
    }

}
module.exports = client;