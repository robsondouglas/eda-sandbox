//const { AsyncLocalStorageTransactionContext, LoggingHook } = require('@openfeature/extra');
const { OpenFeature } =  require('@openfeature/js-sdk')
const {FlagdProvider} = require('@openfeature/flagd-provider')

console.log('init');
OpenFeature.setProvider(new FlagdProvider({
  host: 'eda-flagd', //'ff-playground_flagd_1',
  port: 8013
}));

const client = OpenFeature.getClient()
  
const readStringFlag = async(name, defaultValue) => {
  return await client.getStringValue(name, defaultValue, undefined, {
        hooks: [
          {
            after: (hookContext, evaluationDetails) => {
              console.log(name, evaluationDetails.value, hookContext);
            },
          },
        ],
      });    
}

const readObjectFlag = async(name, defaultValue) => {
  return await client.getObjectValue(name, defaultValue);    
}

module.exports = {
  readStringFlag,
  readObjectFlag
}
