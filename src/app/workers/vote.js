const dotenv = require('dotenv')
dotenv.config();
const Log = require('../../adapters/log')
const psAdapter = require('../../adapters/pubsub/index')
const dbAdpt = require('../../adapters/bd-keyvalue/index')
const tools = require('../../utils/tools')

let queuePort = require('../../ports/queue/index')

async function init(){
    Log.log('Conectando na fila')
    await queuePort.open()
    Log.log('Conectando no publisher')
    await psAdapter.open('VOTE')

    Log.log('VOTE_PROCESS INICIADO')
    while(true)
    {
        await queuePort.receive('VOTE', async(msg)=>{
            let evt = JSON.parse(msg)
            try
            { 
                //EVENT SOURCE
                await dbAdpt.post('vote', evt.id, evt.data)
                await psAdapter.send('VOTE', 'VOTED', JSON.stringify(evt) )
                Log.info('VOTE SENDED', evt.id)
            }
            catch(ex)
            { Log.error(ex) }
        })

        await tools.wait(1000);
    }
}

init()