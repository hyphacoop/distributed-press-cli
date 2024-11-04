const inquirer = require('inquirer')
const socialInboxApi = require('../api/socialInboxApi')
const chalk = require('chalk')
const config = require('../config/config')
const { v4: uuidv4 } = require('uuid')

async function sendPost (message) {
  try {
    console.log(chalk.blue('Sending a post to followers...'))

    const actorUsername = config.actorUsername

    if (!actorUsername) {
      console.log(chalk.yellow('No actor registered. Please register an actor first using "register-actor" command.'))
      return
    }

    const activityId = `${config.socialInboxUrl}/${encodeURIComponent(actorUsername)}/outbox/${uuidv4()}`

    const activity = {
      '@context': 'https://www.w3.org/ns/activitystreams',
      id: activityId,
      type: 'Create',
      actor: config.actorUrl,
      object: {
        id: `${activityId}#object`,
        type: 'Note',
        content: message,
        published: new Date().toISOString(),
        to: ['https://www.w3.org/ns/activitystreams#Public']
      }
    }

    // Send post via Social Inbox API
    const response = await socialInboxApi.sendPost(actorUsername, activity)

    console.log(chalk.green('Post sent successfully!'))
    console.log(`Response: ${JSON.stringify(response.data, null, 2)}`)
  } catch (error) {
    console.error(chalk.red('Error sending post:'), error.message)
  }
}

module.exports = sendPost
