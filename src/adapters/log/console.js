const ConsoleAdapter = {
    log :  (msg, ...msgs)=> setTimeout(()=>console.log(msg, ...(msgs || [])), 0) ,
    warn:  (msg, ...msgs)=> setTimeout(()=>console.warn(msg, ...(msgs || [])), 0),
    error: (msg, ...msgs)=> setTimeout(()=>console.error(msg, ...(msgs || [])), 0),
    info:  (msg, ...msgs)=> setTimeout(()=>console.info(msg, ...(msgs || [])), 0),
}

module.exports = ConsoleAdapter;