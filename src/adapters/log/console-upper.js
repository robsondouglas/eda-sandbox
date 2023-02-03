const exec = (dlg) => {
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            try{
                dlg()
                resolve()
            }
            catch(e){ reject(e) }
        }, 0);
    })
    
}
const ConsoleAdapter = {
    log :  (msg, ...msgs)=> exec(()=>console.log('\x1b[32m%s\x1b[0m',msg.toUpperCase(), ...(msgs || []))) ,
    warn:  (msg, ...msgs)=> exec(()=>console.warn('\x1b[33m%s\x1b[0m', msg.toUpperCase(), ...(msgs || []))),
    error: (msg, ...msgs)=> exec(()=>console.error('\x1b[31m%s\x1b[0m', msg.toUpperCase(), ...(msgs || []))),
    info:  (msg, ...msgs)=> exec(()=>console.info('\x1b[34m%s\x1b[0m', msg.toUpperCase(), ...(msgs || []))),
}

module.exports = ConsoleAdapter;