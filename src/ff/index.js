//const { AsyncLocalStorageTransactionContext, LoggingHook } = require('@openfeature/extra');
const { OpenFeature } =  require('@openfeature/js-sdk')
const {FlagdProvider} = require('@openfeature/flagd-provider')

console.log('init');
OpenFeature.setProvider(new FlagdProvider({
  host: process.env.FLAGD_HOST,
  port: 8013,
  //socketPath: "/tmp/flagd.socks",
}));

const client = OpenFeature.getClient()
  
const readStringFlag = async(name, defaultValue) => {
  return await client.getStringValue(name, defaultValue);    
}

const readObjectFlag = async(name, defaultValue) => {
  return await client.getObjectValue(name, defaultValue, undefined, {
    hooks: [
      {
        after: (hookContext, evaluationDetails) => {
          console.log('readObjectFlag', name, evaluationDetails.value, hookContext);
        },
      },
    ],
  });    
}

module.exports = {
  readStringFlag,
  readObjectFlag
}
