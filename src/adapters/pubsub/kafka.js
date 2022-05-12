const { Kafka } = require('kafkajs')
let conn = {} 
const pubsub = {
    open: async(connName)=> {
        if(!conn[connName])
        {
            

            const srv = new Kafka({
                clientId: connName,
                brokers: process.env.KAFKA_SERVER.split(',').map(m=>m.trim())
            });
            
            const producer = srv.producer()
            conn[connName] = { srv: srv, producer: producer }        
            await producer.connect()
        }
    },
    send : async(connName, topic, msg)=> {
        let producer = conn[connName]?.producer
        if(producer){
            await producer.send({
                topic: topic,
                messages: [ { value: msg } ],
            });
        }
    },
    close: (channel) => {
        if(conn[channel]){
            conn[channel].producer.close();
            conn[channel].srv.close();
            delete conn[channel];
        }
    }
}

module.exports = pubsub