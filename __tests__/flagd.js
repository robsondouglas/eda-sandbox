const dotenv  = require('dotenv');
dotenv.config();

const {randomUUID} = require('crypto');
const { readStringFlag } = require('../src/ff');

describe('FLAGD', ()=>{
    it('READ', async()=>{ 
        const flag = await readStringFlag('adapter-log', 'console');
        expect(flag).toBe('./console')
    });
})
