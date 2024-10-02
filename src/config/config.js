const rc = require('rc')

const defaults = {
  dpApiUrl: 'https://api.distributed.press',
  socialInboxUrl: 'https://social.distributed.press',
  authToken: '',
  keypair: {
    publicKey: '',
    privateKey: ''
  }
}

const config = rc('dprc', defaults)

module.exports = config
