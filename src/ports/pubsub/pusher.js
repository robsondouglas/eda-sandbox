let conn = {};
const pubsub = {
    open : (connName) => {
        return new Promise((resolve, reject)=>{
            if(!conn[connName])
            {
                let Pusher = require('pusher-client');       
                console.log('iniciando ', connName); 
                conn[connName] = new Pusher(process.env.PUSHER_APP_KEY, { cluster: process.env.PUSHER_APP_CLUSTER });
                conn[connName].bind('connected', (res) => {console.log('CONECTADO', res); resolve()})
            }
            else{
                reject(new Error('Já existe uma conexão com esse nome'))   
            }
        })
    },
    subscribe: ({connName, channel, events}) => {
        if(conn[connName])
        {
            let subscription = conn[connName].subscribe(channel)        
            for(let evt of events)
            { subscription.bind(evt.event, evt.delegate) }
        }
    },
    unsubscribe: (connName, channel) => conn[connName].unsubscribe(channel),
    close: (connName) => {
        //conn[connName]?.close()
        delete conn[connName];
    }


}

module.exports = pubsub;