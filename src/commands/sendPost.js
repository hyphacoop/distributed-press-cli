const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const config = require('../config/config')
const socialInboxApi = require('../api/socialInboxApi')

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

    // Read the activity from the file
    const activityData = fs.readFileSync(resolvedPath, 'utf-8')

    // Parse the activity JSON
    const activity = JSON.parse(activityData)

    // Validate the activity
    if (!activity || !activity.type) {
      console.error(chalk.red('Invalid activity data. Please provide a valid ActivityStreams JSON.'))
      return
    }

    // Optionally, update activity IDs and timestamps
    const activityId = `${config.socialInboxUrl}/${encodeURIComponent(actorUsername)}/outbox/${uuidv4()}`
    activity.id = activity.id || activityId
    activity.published = activity.published || new Date().toISOString()
    activity.actor = activity.actor || config.actorUrl

    // If the activity contains an object (e.g., a Note), ensure it has an ID
    if (activity.object && !activity.object.id) {
      activity.object.id = `${activity.id}#object`
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
