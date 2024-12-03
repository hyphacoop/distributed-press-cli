const rc = require('rc')

const defaults = {
  dpApiUrl: 'https://api.distributed.press/v1',
  socialInboxUrl: 'https://social.distributed.press/v1',
  authToken: '',
  keypair: {
    publicKeyPem: '',
    privateKeyPem: ''
  },
  domain: '',
  actorUsername: '',
  actorUrl: '',
  publicKeyId: ''
}

const config = rc('dp', defaults)

module.exports = config
