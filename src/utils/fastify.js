const Log = require('../adapters/log');

function bindRoutes(app, {method, path, delegate}){
    app[method.toLowerCase()]?.(path, async(request, response, next)=>{
            
        const _res = await delegate({
            body:        request.body,
            params:      request.params, 
            querystring: request.query, 
            headers:     request.headers
        });

        response
            .status(_res.status)
            .send(_res.body);
    });
}

const servers = [];

const server = {
    start: async({routes, port}) => {
        const fastify = require('fastify')();
        
        for(let route of routes)
        { bindRoutes(fastify, route) };
        
        await fastify.listen(port);
        servers.push({port: port, srv: fastify})
        return fastify;
        
    },
    stop: async(port)=> {
        const idx = servers.findIndex(f=>f.port === port);
        if(idx >=0 )
        {
            Log.log(`Encerrando Servidor Nodejs + express na porta ${port}`)
            await servers[idx]?.srv.close();
            delete servers[idx];
            servers.splice(idx, 1);
        }
    }
}

module.exports = server; 