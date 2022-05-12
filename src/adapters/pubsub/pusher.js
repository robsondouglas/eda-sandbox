let conn = null; 

const pubsub = {
    open: ()=> {
        let Pusher = require('pusher');
        conn = new Pusher({
            appId:      process.env.PUSHER_APP_ID,
            key:        process.env.PUSHER_APP_KEY,
            secret:     process.env.PUSHER_APP_SECRET,
            cluster:    process.env.PUSHER_APP_CLUSTER
        });
       // conn.bind('connected', (res) => {console.log('CONECTADO', res)})
                
    },
    send : (channel, event, msg)=> {
        conn.trigger(channel, event, msg);
    },
    close: () => {
        //conn.close();
    }
}

module.exports = pubsub