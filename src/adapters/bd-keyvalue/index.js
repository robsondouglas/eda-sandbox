const  MemBD  = require('./membd')

const BDKeyValue = {
    get :    MemBD.get,
    exec:    MemBD.exec,
    delete : MemBD.delete,
    post:    MemBD.post,
    put:     MemBD.put
}

module.exports = BDKeyValue;