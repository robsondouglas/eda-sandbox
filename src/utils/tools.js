
/** 
    * CRIA UM ATRASO ANTES DE CONTINUAR COM O FLUXO DE EXECUÇÃO
    * @param {number} timeout - Tempo de espera em milessegundos  
*/
const wait = (timeout) => new Promise(resolve => {
    let tmr = setInterval(()=>{ 
        clearInterval(tmr)
        resolve()
    }, timeout)
})


/** 
    * Realiza tentativas até que obtenha sucesso ou atinja o limite definido
    * @param {Function} dlg - Delegate que será executado em loop
    * @param {number} retries - Número de tentativas. Default 0 = infinito
    * @param {number} delay - Tempo de espera em milissegundos entre as tentativas. Default 0 = sem efeito
    * @param {number} increase - Aumento no tempo de espera em milissegundos, mas depende que delay seja maior que zero. Default 0 = sem efeito
    * @return {Promise<any>} Retorna o resultado de dlg  
*/
const retry = (async(dlg, retries=0, delay=0, increase=0)=>{
    return new Promise(async(resolve, reject)=>{
        let completed = false;
        let step = 0;
        while(!completed){
            try{
                step++;
                const res = await dlg();
                completed = true;
                resolve(res);
           }
           catch(ex)
           {
             if(delay>0)
             { await wait(delay + (increase * (step-1))) }

             if(retries!=0 && step >= retries)
             {  
                reject(ex);
                completed = true;
             }
           }
        }
       
    });
})

module.exports = {
    wait, retry
}
