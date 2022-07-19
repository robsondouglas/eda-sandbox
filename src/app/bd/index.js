const dotenv = require('dotenv')
dotenv.config();
const apiPort   = require('../../ports/webserver/index');
const Log       = require('../../adapters/log');
    
const db = {}

const eng = {
    take : (entity, filter, page = 0, size) => {
        if(db[entity] === undefined)
        { return [] }
        else
        {
            let itms = filter ? db[entity].filter(filter) : db[entity]
            return itms.slice( page*size, size === 0 ? itms.length : size )
        }
        
    },
    
    list: (entity) => (db[entity] === undefined) ? [] : db[entity],
    
    find : (entity, key)        => db[entity]?.find( f=> f.key === key),
    save:   (entity, key, value) => {
        if(!db[entity])
        { db[entity] = [] }
        
        let itm = eng.find(entity, key);
        
        if(itm)
        { itm.value = value }
        else
        { db[entity].push({key: key, value: value}) }
    },
    del: (entity, key) => {
        let tbl = db[entity]
        if(tbl)
        {  
            let idx = db[entity].findIndex( f=> f.key === key)
            db[entity].splice(idx, 1)
            if( db[entity].length === 0 )
            { delete db[entity] }
        }
    },
    exec: (entity, key, expression)=> {
        let tbl = db[entity]
        if(!tbl)
        { db[entity] = [] }
        
        let itm = db[entity].find( f=> f.key === key)
        if(itm == null)
        { 
            itm = { key: key }
            db[entity].push(itm)
        }

        let fnc = eval(expression)
        try
        { return fnc(itm) }
        catch(ex)
        {
            Log.log('Falha ao executar a expressão', expression, ex)
            return null
        }
    }
}

async function init(){
    const routes = [
        { 
            method: 'POST',  
            path:'/bd/:entity/take',  
            delegate: async({params}) => {
                return {status:200, body: eng.take(params.entity, params.page, params.size)}
            }
        },
        { 
            method: 'GET',  
            path:'/bd/:entity/:key',  
            delegate: async({params}) => {
                return {status:200, body: eng.find(params.entity, params.key) || ''}
            }
        },
        { 
            method: 'GET',  
            path:'/bd/:entity',  
            delegate: async({params}) => {
                 return {status:200, body: eng.list(params.entity)}
            }
        },
        { 
            method: 'POST',  
            path:'/bd/:entity/:key',  
            delegate: async({params, body}) => {
                eng.save(params.entity, params.key, body)
                return {status:201}
            }
        },
        {
            method: 'PATCH',  
            path:'/bd/:entity/:key',  
            delegate: async({params, body}) => {
                let res = eng.exec(params.entity, params.key, body.expression)
                return {status:200, body: res}
            }
        }
    ];
    
    const port = process.env.PORT_NUMBER 
    
    Log.log('INICIANDO BD:', port)
    apiPort.start({routes: routes, port: port});
}
init()
