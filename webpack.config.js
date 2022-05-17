const path = require('path')
const nodeExternals = require('webpack-node-externals')

const entryFile = {
    'bd-mem': './src/app/bd/index.js',
    'vote_api': './src/app/api/index.js',
    'worker_vote': './src/app/workers/vote.js',
    'worker_aggregator': './src/app/workers/aggregator.js',
    'ws_server': './src/ws/index.js'
}[process.env.appname]


module.exports = {
  entry: entryFile,
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist')
  },
  target: 'node',   // THIS IS THE IMPORTANT PART
  externals: [nodeExternals()],
  mode: 'production'
}