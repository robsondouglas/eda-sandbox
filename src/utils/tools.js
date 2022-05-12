 const wait = (timeout) => new Promise(resolve => {
    let tmr = setInterval(()=>{ 
        clearInterval(tmr)
        resolve()
    }, timeout)
})

module.exports = {
    wait : wait
}
