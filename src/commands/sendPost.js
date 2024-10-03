const inquirer = require('inquirer')
const dpApi = require('../api/dpApi')
const socialInboxApi = require('../api/socialInboxApi')
const chalk = require('chalk')

async function sendPost (message) {
  try {
    console.log(chalk.blue('Sending a post to followers...'))

    // Fetch existing sites
    const sites = await dpApi.getSites()

    if (sites.data.length === 0) {
      console.log(chalk.yellow('No sites found. Please create a site first using "create-site" command.'))
      return
    }

    // Prompt user to select a site
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'siteId',
        message: 'Select a site to send a post from:',
        choices: sites.data.map(site => ({
          name: `${site.name} (${site.url})`,
          value: site.id
        }))
      }
    ])

    // Send post via Social Inbox API
    const response = await socialInboxApi.sendPost(answers.siteId, message)

    console.log(chalk.green('Post sent successfully!'))
    console.log(`Post ID: ${response.data.postId}`)
  } catch (error) {
    console.error(chalk.red('Error sending post:'), error.message)
  }
}

module.exports = sendPost
