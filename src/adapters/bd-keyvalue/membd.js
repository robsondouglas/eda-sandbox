const { default: axios } = require('axios')

const dbUrl = process.env.DB_URL

const MemBD = {
    get :    async (entityName, key)                                => (await axios.get(key ? `${dbUrl}/${entityName}/${key}` : `${dbUrl}/${entityName}`)).data,
    exec:    async (entityName, key, delegate)                      => (await axios.patch(`${dbUrl}/${entityName}/${key}`, {expression: delegate.toString()})).data,
    delete : async (entityName, key)                                => (await axios.delete(`${dbUrl}/${entityName}/${key}`)).data,
    post:    async (entityName, key, value)                         => (await axios.post(`${dbUrl}/${entityName}/${key}`, value)).data,
    put:     async (entityName, key, value)                         => (await axios.put(`${dbUrl}/${entityName}/${key}`, value)).data,
    take:    async (entityName, filter = null, skip = 0 , size = 0) => (await axios.post(`${dbUrl}/${entityName}/take`, { filter: filter?.toString(), skip: skip, size: size })).data
}

module.exports = MemBD;