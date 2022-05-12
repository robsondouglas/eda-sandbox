const { default: axios } = require('axios')
const Log = require('../../adapters/log')
const dotenv = require('dotenv')
//const psAdapter = require('../../adapters/pubsub/index')
const psPort = require('../../ports/pubsub/index')
const wsAdpt = require('../../adapters/websocket/index')

dotenv.config();

async function init(){
    console.log('INICIANDO... PUBSUB')
    await psPort.open('CLI-VOTE')
    console.log('INICIANDO... WEBSOCKER', process.env.WSURL)
    await wsAdpt.open({connName: 'NOTIFY', url: process.env.WSURL});

    console.log('AGGREGATOR INICIADO')
    
    await psPort.subscribe({connName: 'CLI-VOTE', channel: 'VOTED', events: async(msg)=> {
        try{
            const evt = JSON.parse(msg)
            console.log('VOTED RECEIVED', evt.id)
            let date = new Date()
            let min  = Math.floor(date.valueOf()/(60*1000))*(60*1000)
            let hour = Math.floor(date.valueOf()/(60*60*1000))*(60*60*1000)

            let expression = `(itm) => {
                if(itm.value)
                { itm.value.qtd++}
                else
                { itm.value = {qtd: 1} }
                return itm
            }`

            console.log('sending...')
            Promise.all([
                
                //TOTAL POR COR
                axios.patch(`${process.env.DB_URL}/cor/${evt.data.id}`, {expression: expression}),
                
                //TOTAL POR HORA, SEPARADO POR COR
                axios.patch(`${process.env.DB_URL}/hour_cor/${hour}_${evt.data.id}`, {expression: expression}),
                
                //TOTAL POR HORA
                axios.patch(`${process.env.DB_URL}/hour/${hour}`, {expression: expression}),
                
                //TOTAL POR MINUTO, SEPARADO POR COR
                axios.patch(`${process.env.DB_URL}/min_cor/${min}_${evt.data.id}`, {expression: expression}),
                
                //TOTAL POR MINUTO
                axios.patch(`${process.env.DB_URL}/min/${min}`, {expression: expression}),

                //TOTAL GERAL
                axios.patch(`${process.env.DB_URL}/all/all`, {expression: expression})
            ]).then(async([totalCor, totalHoraCor, totalHora, totalMinutoCor, totalMinuto, total])=>{
                let res = { 
                    totalHora: totalHora.data.value.qtd,
                    totalMinuto: totalMinuto.data.value.qtd,
                    total: total.data.value.qtd
                }
                
                let msg = JSON.stringify(res)
                
                await wsAdpt.send({connName: 'NOTIFY', eventName: 'QTD_NOTIFICATION', msg:  msg})
            }, err=> console.log('erro') )
                        
        }
        catch(ex)
        { console.error(ex) }
    }})
        
        
}

init()