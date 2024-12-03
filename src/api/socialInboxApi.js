const config = require('../config/config')
const chalk = require('chalk')

async function loadHttpSignedFetch () {
  try {
    const fetchModule = await import('http-signed-fetch')
    const fetch = fetchModule.default || fetchModule.fetch

    if (typeof fetch !== 'function') {
      throw new Error('fetch is not a function in http-signed-fetch')
    }

    return fetch
  } catch (error) {
    console.error(chalk.red('Failed to load http-signed-fetch:'), error.message)
    throw error
  }
}

async function registerActor (actorUsername, actorInfo) {
  try {
    const fetch = await loadHttpSignedFetch()

    const url = `${config.socialInboxUrl}/${encodeURIComponent(actorUsername)}`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        date: new Date().toUTCString(),
        host: new URL(url).host
      },
      keypair: actorInfo.keypair, // Private and public key
      publicKeyId: actorInfo.publicKeyId,
      body: JSON.stringify({
        actorUrl: actorInfo.actorUrl,
        publicKeyId: actorInfo.publicKeyId,
        keypair: {
          publicKeyPem: actorInfo.keypair.publicKeyPem,
          privateKeyPem: actorInfo.keypair.privateKeyPem
        }
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
    }

    const data = await response.json()
    return { data }
  } catch (error) {
    console.error(
      chalk.red('Social Inbox API Error:', error.message)
    )
    throw error
  }
}

async function sendPost (actorUsername, activity) {
  try {
    const fetch = await loadHttpSignedFetch()

    const url = `${config.socialInboxUrl}/${encodeURIComponent(actorUsername)}/outbox`

    // Debugging: Log the request details
    console.log(chalk.blue('Sending to URL:'), url)
    console.log(chalk.blue('Activity Payload:'), JSON.stringify(activity, null, 2))
    console.log(chalk.blue('Keypair being used:'), config.keypair)
    console.log(chalk.blue('PublicKeyId being used:'), config.publicKeyId)

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/ld+json',
        date: new Date().toUTCString(),
        host: new URL(url).host
      },
      keypair: config.keypair, // Private and public key
      publicKeyId: config.publicKeyId,
      body: JSON.stringify(activity)
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
    }

    const data = await response.json()
    return { data }
  } catch (error) {
    console.error(
      chalk.red('Social Inbox API Error:', error.message)
    )
    throw error
  }
}

module.exports = {
  registerActor,
  sendPost
}
