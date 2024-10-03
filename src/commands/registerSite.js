const inquirer = require('inquirer')
const socialInboxApi = require('../api/socialInboxApi')
const dpApi = require('../api/dpApi')
const chalk = require('chalk')

async function registerSite () {
  try {
    console.log(chalk.blue('Registering site with Social Inbox...'))

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
        message: 'Select a site to register:',
        choices: sites.data.map(site => ({
          name: `${site.name} (${site.url})`,
          value: site.id
        }))
      }
    ])

    // Register site with Social Inbox
    const response = await socialInboxApi.registerSite(answers.siteId)

    console.log(chalk.green('Site registered with Social Inbox successfully!'))
    console.log(`Registration ID: ${response.data.registrationId}`)
  } catch (error) {
    console.error(chalk.red('Error registering site:'), error.message)
  }
}

module.exports = registerSite
