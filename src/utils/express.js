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
    start: ({routes, port}) => {
        const express = require('express');
        const _app    = express();
        _app.use(express.json());
        _app.use(express.urlencoded({ extended: true }));
        
        const _srv = require('http').Server(_app);

        for(let route of routes)
        { bindRoutes(_app, route) };
        
        _srv.listen(port, ()=> Log.log(`Iniciando Servidor Nodejs + express na porta ${port}`));
        servers.push({port: port, srv: _srv})
        return _srv;
        
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