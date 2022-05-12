const path = require('path')
const nodeExternals = require('webpack-node-externals')

const entryFile = {
    'mem_bd': './src/app/bd/index.js',
    'vote_api': './src/app/api/index.js',
    'worker_vote': './src/app/worker/vote.js',
    'worker_aggregator': './src/app/worker/aggregator.js'
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