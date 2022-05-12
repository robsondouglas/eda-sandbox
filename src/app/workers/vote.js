const { default: axios } = require('axios')
const Log = require('../../adapters/log')
const psAdapter = require('../../adapters/pubsub/index')
const dotenv = require('dotenv')

dotenv.config();

let queuePort = require('../../ports/queue/index')
const wait = (timeout) => new Promise(resolve => setInterval(resolve, timeout));

async function init(){
    await queuePort.open()
    await psAdapter.open('VOTE')

    Log.log('VOTE_PROCESS INICIADO')
    while(true)
    {
        await queuePort.receive('VOTE', async(msg)=>{
            let evt = JSON.parse(msg)
            try
            { 
                //EVENT SOURCE
                await axios.post(`${process.env.DB_URL}/vote/${evt.id}`, evt.data)
                await psAdapter.send('VOTE', 'VOTED', JSON.stringify(evt) )
                console.info('VOTE SENDED', evt.id)
            }
            catch(ex)
            { console.error('erro', ex) }
                        
        })

        await wait(1000);
    }
}

init()