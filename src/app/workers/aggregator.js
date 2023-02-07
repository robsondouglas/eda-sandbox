const dotenv = require('dotenv')
dotenv.config();

const Log    = require('../../adapters/log')
const psPort = require('../../ports/pubsub/index')
const wsAdpt = require('../../adapters/websocket/index')
const bdAdpt = require('../../adapters/bd-keyvalue/index');
const { retry } = require('../../utils/tools');

async function init(){
    
    await retry(async()=>{
        Log.log('INICIANDO... PUBSUB');
        await psPort.open('CLI-VOTE');
    },0,1000);

    await retry(async()=>{
        Log.log('INICIANDO... WEBSOCKER', process.env.WS_URL)
        await wsAdpt.open({connName: 'NOTIFY', url: process.env.WS_URL});
    },0,1000);

    Log.log('AGGREGATOR INICIADO')
    
    await psPort.subscribe({connName: 'CLI-VOTE', channel: 'VOTED', events: async(msg)=> {
        try{
            const evt = JSON.parse(msg)
            Log.info('VOTE RECEIVED', evt.id)
            let date = new Date()
            let min  = `min_${Math.floor(date.valueOf()/(60*1000))*(60*1000)}`
            let hour = `hour_${Math.floor(date.valueOf()/(60*60*1000))*(60*60*1000)}`

            let expression = (itm) => {
                if(itm.value)
                { itm.value.qtd++}
                else
                { itm.value = {qtd: 1} }
                return itm
            }

            Log.log('Saving aggregated data in DB...')
            Promise.all([
                
                //TOTAL POR COR
                bdAdpt.exec('cor', evt.data.id, expression),
                
                //TOTAL POR HORA, SEPARADO POR COR
                bdAdpt.exec('hour_cor', `${hour}_${evt.data.id}`, expression),
                
                //TOTAL POR HORA
                bdAdpt.exec('hour', hour, expression),
                
                //TOTAL POR MINUTO, SEPARADO POR COR
                bdAdpt.exec('min_cor', `${min}_${evt.data.id}`, expression),
                
                //TOTAL POR MINUTO
                bdAdpt.exec('min', min, expression),
                
                //TOTAL GERAL
                bdAdpt.exec('all', 'all', expression),
            ]).then(async([totalCor, totalHoraCor, totalHora, totalMinutoCor, totalMinuto, total])=>{
                let res = { 
                    totalCor:       {id: totalCor.key,          qtd: totalCor.value.qtd},
                    totalHora:      {id: totalHora.key,         qtd: totalHora.value.qtd},
                    totalHoraCor:   {id: totalHoraCor.key,      qtd: totalHoraCor.value.qtd},
                    totalMinuto:    {id: totalMinuto.key,       qtd: totalMinuto.value.qtd},
                    totalMinutoCor: {id: totalMinutoCor.key,    qtd: totalMinutoCor.value.qtd},
                    total:          {id: total.key,             qtd: total.value.qtd}
                }
                
                await wsAdpt.send({connName: 'NOTIFY', eventName: 'QTD_NOTIFICATION', msg:  JSON.stringify(res)})
            }, err=> Log.error(err) )
                        
        }
        catch(ex)
        { Log.error(ex) }
    }})
        
        
}

init()