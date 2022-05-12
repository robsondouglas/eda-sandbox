const ws = require('./socket-io');

/**
 * Conexão com Websocket
 */
const websocket = {
    
     /** 
     * @typedef {Object} eventDefinition
     * @property {string} event - Nome do evento
     * @property {((msg:any[])=>void)} delegate - função delegate que receberá a lista de mensagens
     */

    /** 
     * @typedef {Object} startConfig
     * @property {number} port - Porta de conexão
     * @property {eventDefinition[]} events - Eventos que serão ouvidos
     * @property {(id:string)=>void}  onConnect - Executado quando um client se conecta
     * @property {()=>void} onDisconnect - Executado quando um client se desconecta
     */

    /** 
     * INICIA O SERVIDOR DE WEBSOCKET
     * @param {startConfig} cfg - Parâmetros de inicialização 
    */
    start:          (cfg) => ws.start(cfg),
    getClients:     ws.getClients,
    send:           ws.send,
    createRoom:     ws.createRoom,
    closeRoom:      ws.closeRoom,
    joinRoom:       ws.joinRoom,
    leaveRoom:      ws.leaveRoom,
    close:          ws.close
}

module.exports = websocket;