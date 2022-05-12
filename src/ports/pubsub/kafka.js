const { Kafka } = require('kafkajs')
let conn = {};

const pubsub = {
    open : async(connName) => {
        if(!conn[connName])
        {
            const srv = new Kafka({
                brokers: process.env.KAFKA_SERVER.split(',').map(m=>m.trim())
            });

            conn[connName] = { server: srv, channels: {} };        
        }
    },
    subscribe: async({connName, channel, events}) => {
        const _conn = conn[connName];
        if(_conn)
        {
            if(!_conn.channels[channel]){
                const consumer = _conn.server.consumer({ groupId: connName })
                _conn.channels[channel] = consumer;
                
                await consumer.connect()
                await consumer.subscribe({ topic: channel, fromBeginning: true })
                await consumer.run({eachMessage: async ({message}) =>  events?.(message?.value?.toString())})                
            }
        }
    },
    unsubscribe: async (connName, channel) => {
        const _conn = conn[connName];
        if(_conn){
            await _conn.channels[channel]?.disconnect();
            delete _conn.channels[channel]
        }
    },
    close: async (connName) => {
        const _conn = conn[connName];
        if(_conn){
            for(let channel in _conn.channels)
            { 
                await _conn.channels[channel].disconnect();
                delete _conn.channels[channel]
            }
        }

        delete conn[connName];
    }


}

module.exports = pubsub;