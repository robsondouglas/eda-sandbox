const dotenv = require('dotenv')
dotenv.config();
const {randomUUID} = require('crypto');
const { readStringFlag, readObjectFlag } = require('../../ff');

const apiPort   = require('../../ports/webserver/index');
const queueAdpt = require('../../adapters/queue/index');
const Log       = require('../../adapters/log');
const bdAdpt    = require('../../adapters/bd-keyvalue/index');
const { createCaptcha, createCaptchaSync } = require('captcha-canvas');
const { wait, retry } = require('../../utils/tools');
    
async function init(){
    await retry(async()=>{
        console.log('Aguardando conectividade com a fila...');
        await queueAdpt.open()
    },0,1000);
    
    
    const routes = [
        {
            method: 'GET',
            path: '/opcoes',
            delegate:  async()=>{
                const {items} = await readObjectFlag('options');
                return {status:200, body: JSON.stringify(items)}
            }
        },
        {
            method: 'GET',
            path: '/ux',
            delegate: async()=>  ({status:200, body: JSON.stringify(await readObjectFlag('ux'))})            
        },
        {
            method: 'GET',
            path: '/captcha',
            delegate: async()=> {
                const {captcha} = await readObjectFlag('ux');
                
                if(captcha){
                    try{
                        const { image, text } = createCaptchaSync(300, 100);
                        const hash = randomUUID();
                        bdAdpt.post('captcha', hash, {secret: text});
                        return { status: 200, body: JSON.stringify({ hash, img: image.toString('base64') }) }
                    }
                    catch(ex){
                        return {status: 200, body: 'Erro ao gerar captcha'}
                    }
                }
                else{
                    return {status: 404, body: 'Not Found'}
                }
            }
        },
        { 
            method: 'POST',  
            path:'/vote',  
            delegate: async({body}) => {
                Log.log('Votando', body)
                const {items} = await readObjectFlag('options');
                const {captcha} = await readObjectFlag('ux');
                if(captcha){
                    if(!body.code || !body.hash )
                    { return { status: 500, body: 'Implemente o captcha' } }
                    else 
                    {
                        const _hash = await bdAdpt.get('captcha', body.hash);
                        
                        if( _hash?.value?.secret?.toLowerCase() !== body.code.toLowerCase() )
                        { return { status: 500, body: 'Captcha incorreto' } }
                    }
                }
                 
                let itm = items.find( f=> f.id === body.id )
                if(!itm)
                { return {status: 500, body: 'Voto inválido'} }
                
                try{
                    let evt = { 
                        id: randomUUID(), 
                        data: itm,
                        timestamp: (new Date()).valueOf() 
                    };

                    await queueAdpt.send('VOTE', evt);

                    Log.log('Voto salvo', evt);
                    return {status:201, body: ''};
                }
                catch(ex){
                    Log.error('Erro ao registrar voto', ex)
                    return {status:500, body: ex}
                }
            }
        },

        {
            method: 'GET',
            path: '/votes/',
            delegate: async()=> {
                return {
                    status: 200,
                    body: JSON.stringify(await bdAdpt.get('cor'))
                }
            }
        },
        {
            method: 'GET',
            path: '/votesminutes/',
            delegate: async()=>{
                return {
                    status: 200,
                    body: JSON.stringify(await bdAdpt.get('min_cor'))
                }
            }
        }
    ];
    
    const port = process.env.PORT_NUMBER 
    
    Log.log('INICIANDO VOTE:', port)
    apiPort.start({routes: routes, port: port});

    
}

init()