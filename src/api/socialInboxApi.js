const config = require('../config/config')
const chalk = require('chalk')
const httpsig = require('http-signed-fetch')

async function registerActor (actorUsername, actorInfo) {
  try {
    const url = `${config.socialInboxUrl}/${encodeURIComponent(actorUsername)}`
    const signer = new httpsig.Signer({
      keyId: actorInfo.publicKeyId,
      privateKey: actorInfo.keypair.privateKeyPem,
      headers: ['(request-target)', 'host', 'date', 'digest']
    })

    const response = await httpsig.fetch(url, {
      method: 'POST',
      body: JSON.stringify(actorInfo),
      headers: {
        'Content-Type': 'application/json'
      },
      signer
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
    }

    const data = await response.json()
    return { data }
  } catch (error) {
    console.error(
      chalk.red('Social Inbox API Error:', error.response ? error.response.data : error.message)
    )
    throw error
  }
}

async function sendPost (actorUsername, activity) {
  try {
    const url = `${config.socialInboxUrl}/${encodeURIComponent(actorUsername)}/outbox`
    const signer = new httpsig.Signer({
      keyId: config.publicKeyId,
      privateKey: config.keypair.privateKeyPem,
      headers: ['(request-target)', 'host', 'date', 'digest']
    })

    const response = await httpsig.fetch(url, {
      method: 'POST',
      body: JSON.stringify(activity),
      headers: {
        'Content-Type': 'application/ld+json'
      },
      signer
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
    }

    const data = await response.json()
    return { data }
  } catch (error) {
    console.error(
      chalk.red('Social Inbox API Error:', error.response ? error.response.data : error.message)
    )
    throw error
  }
}

module.exports = {
  registerActor,
  sendPost
}
