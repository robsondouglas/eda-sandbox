const {describe, expect, it } = require('@jest/globals')
const dotenv  = require('dotenv');
dotenv.config();
const { default: axios } = require('axios')



describe('MEMBD', ()=>{
    let key = (new Date()).valueOf()

    it('EXEC', async()=>{
        let expression = `(itm) => {
            if(itm.value)
            { itm.value.qtd++}
            else
            { itm.value = {qtd: 1} }
            return itm
        }`

        
        let res = await axios.patch(`${process.env.DB_URL}/teste_update/${key}`, {expression: expression})
        expect(res.data.value.qtd).toEqual(1)
        
        res = await axios.patch(`${process.env.DB_URL}/teste_update/${key}`, {expression: expression})
        expect(res.data.value.qtd).toEqual(2)
    })

    it('GET', async()=>{
        res = await axios.get(`${process.env.DB_URL}/teste_update/${key}`)
        expect(res.data.value.qtd).toEqual(2)
    })
})