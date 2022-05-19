
const dotenv  = require('dotenv');
dotenv.config();
const MemBD = require('../src/adapters/bd-keyvalue/membd');
const {randomUUID} = require('crypto');

describe('MEMBD', ()=>{
    let key = (new Date()).valueOf()
    const entityTest = `entity_teste_${randomUUID()}`
    it('EXEC', async()=>{
        let tst = (itm) => {
            if(itm.value)
            { itm.value.qtd++}
            else
            { itm.value = {qtd: 1} }
            return itm
        }
        
        await expect(MemBD.exec('teste_update', key, tst).then(v=>v.value)).resolves.toMatchObject({qtd: 1})
        await expect(MemBD.exec('teste_update', key, tst).then(v=>v.value)).resolves.toMatchObject({qtd: 2})        
    })

    it('GET', async()=>{
        await expect(MemBD.get('teste_update', key).then(v=>v.value)).resolves.toMatchObject({qtd: 2})
    })

    it('LIST', async()=>{
        res = await MemBD.take('teste_update')
        expect(res.length).toEqual(1)
    })
})