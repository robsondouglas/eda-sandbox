const { default: axios } = require('axios')

const MemBD = {
    get :    async (entityName, key)                                => (await axios.get(`${process.env.DB_URL}/${entityName}/${key}`)).data,
    exec:    async (entityName, key, delegate)                      => (await axios.patch(`${process.env.DB_URL}/${entityName}/${key}`, {expression: delegate.toString()})).data,
    delete : async (entityName, key)                                => (await axios.delete(`${process.env.DB_URL}/${entityName}/${key}`)).data,
    post:    async (entityName, key, value)                         => (await axios.post(`${process.env.DB_URL}/${entityName}/${key}`, value)).data,
    put:     async (entityName, key, value)                         => (await axios.put(`${process.env.DB_URL}/${entityName}/${key}`, value)).data,
    take:    async (entityName, filter = null, skip = 0 , size = 0) => (await axios.post(`${process.env.DB_URL}/${entityName}/take`, { filter: filter?.toString(), skip: skip, size: size })).data
}

module.exports = MemBD;