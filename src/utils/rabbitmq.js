const Log = require('../adapters/log');

let conns = {};

async function openConnection(srv){
    Log.log('Abrindo conexão', srv);
    if(!conns[srv])
    {
        const amplib = require('amqplib'); 
        const conn = await amplib.connect(srv);
        conns[srv] = conn;
        Log.log('Conexão criada!');
    }
}

function closeConnection(srv){
    Log.log('Fechando conexão', srv);
    
    return new Promise((resolve, reject)=>{
        setTimeout(async()=>{
            try{
                await conns[srv]?.close();
                delete conns[srv];
                Log.log('Conexão fechada!');
                resolve();
            }
            catch(ex)
            { reject(ex) }
        }, 100);//-->RABBITMQ encerra mesmo se tiver enviando ou rebendo algo no momento.
    })
    
    
}

async function getChannel(srv){
    Log.log('Obtendo canal', srv); 
    if(conns[srv])
    { return  await conns[srv].createChannel()}
    else
    { throw new Error("Connection Closed") } 
}

const RabbitMQ = {
    open : openConnection, 
    close: closeConnection,
    send : async ( serverUrl, queueName, msg ) => {
        Log.log('Enviando mensagem', serverUrl, queueName);
        const ch = await getChannel(serverUrl);
        
        try {
            //await ch.assertQueue(queueName);        
            
            if(!ch.sendToQueue(queueName, Buffer.from(JSON.stringify(msg)) ))
            { throw new Error('Falha ao enviar') }
            
            Log.log('Mensagem enviada', serverUrl, queueName);
        }
        finally
        { ch.close(); }        
    },
    receive : async(serverUrl, queueName, callback) => {
        const ch = await getChannel(serverUrl);
        
        ch.assertQueue(queueName)
        await ch.consume(queueName, (msg)=>
        {
            try { 
                callback(msg.content.toString());
                ch.ack(msg); 
            }
            catch(ex)
            { ch.nack(msg); }
        }, { noAck:true });
        
        ch.close();
    }
}

module.exports = RabbitMQ;