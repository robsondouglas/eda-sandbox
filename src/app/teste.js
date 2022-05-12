const dotenv = require('dotenv')
dotenv.config();

let psAdpt = require('../adapters/pubsub/index')
let psPort = require('../ports/pubsub/index')

const wait = (timeout) => new Promise(resolve => setInterval(resolve, timeout));


async function init(){
  
  await psPort.open('CLIENT1')
  await psPort.open('CLIENT2')

  await psPort.subscribe({connName: 'CLIENT1', channel: 'EVENTO1', events:  (msg)=>console.log(msg, 'CLI1')})
  await psPort.subscribe({connName: 'CLIENT2', channel: 'EVENTO1', events:  (msg)=>console.log(msg, 'CLI2')})

  for(let x=1; x<=10; x++){

    await psAdpt.open('SERVER')
    await psAdpt.send('SERVER', 'EVENTO1', `TESTE ${x}` );
    await wait(3000)
  }
}

init();
