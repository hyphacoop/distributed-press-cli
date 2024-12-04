const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const socialInboxApi = require('../api/socialInboxApi')
const config = require('../config/config')

async function sendPost (activityPath) {
  try {
    console.log(chalk.blue('Sending a post to followers...'))

    const actorUsername = config.actorUsername

    if (!actorUsername) {
      console.log(
        chalk.yellow(
          'No actor registered. Please register an actor first using "register-actor" command.'
        )
      )
      return
    }

    // Resolve the activity file path
    const resolvedPath = path.resolve(activityPath)

    // Check if the file exists
    if (!fs.existsSync(resolvedPath)) {
      console.error(chalk.red(`Activity file not found at path: ${resolvedPath}`))
      return
    }

    // Read and parse the Note JSON file
    const noteData = fs.readFileSync(resolvedPath, 'utf-8')
    const note = JSON.parse(noteData)

    // Validate the Note
    if (!note || !note.type || note.type !== 'Note') {
      console.error(chalk.red('Invalid Note data. Please provide a valid ActivityStreams Note JSON.'))
      return
    }

    // Get the domain dynamically from config
    const domain = config.domain

    // Create a Create Activity that references the Note
    const activityId = `https://${domain}/activities/${path.basename(activityPath, '.jsonld')}.jsonld`

    const createActivity = {
      '@context': 'https://www.w3.org/ns/activitystreams',
      id: activityId,
      type: 'Create',
      actor: config.actorUrl,
      published: new Date().toISOString(),
      to: ['https://www.w3.org/ns/activitystreams#Public'],
      object: note
    }

    // Optional: Log the Create Activity being sent for debugging
    console.log(chalk.blue('Create Activity being sent:'), JSON.stringify(createActivity, null, 2))

    // Send the Create Activity to the Social Inbox API
    const response = await socialInboxApi.sendPost(actorUsername, createActivity)

    if (response && response.data) {
      console.log(chalk.green('Post sent successfully!'))
      console.log(`Response: ${JSON.stringify(response.data, null, 2)}`)
    } else {
      console.error(chalk.red('Error sending post: No response data received'))
    }
  } catch (error) {
    console.error(chalk.red('Error sending post:'), error.message)
  }
}

module.exports = sendPost
