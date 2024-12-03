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

    // Read and parse the activity JSON file
    const activityData = fs.readFileSync(resolvedPath, 'utf-8')
    const activity = JSON.parse(activityData)

    // Validate the activity
    if (!activity || !activity.type) {
      console.error(chalk.red('Invalid activity data. Please provide a valid ActivityStreams JSON.'))
      return
    }

    // Ensure required fields are present
    activity.actor = activity.actor || config.actorUrl
    activity.published = activity.published || new Date().toISOString()

    if (activity.object && !activity.object.id) {
      activity.object.id = `${activity.id || config.actorUrl}#object`
    }

    // Send the activity to the Social Inbox API
    const response = await socialInboxApi.sendPost(actorUsername, activity)

    console.log(chalk.green('Post sent successfully!'))
    console.log(`Response: ${JSON.stringify(response.data, null, 2)}`)
  } catch (error) {
    console.error(chalk.red('Error sending post:'), error.message)
  }
}

module.exports = sendPost
