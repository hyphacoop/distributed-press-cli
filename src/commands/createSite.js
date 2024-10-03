const inquirer = require('inquirer')
const dpApi = require('../api/dpApi')
const chalk = require('chalk')

async function createSite () {
  try {
    console.log(chalk.blue('Creating a new site on Distributed Press...'))

    // Prompt user for site details
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'siteName',
        message: 'Enter your site name:',
        validate: (input) => input ? true : 'Site name cannot be empty.'
      },
      {
        type: 'input',
        name: 'siteUrl',
        message: 'Enter your site URL:',
        validate: (input) => /^https?:\/\/.+/.test(input) ? true : 'Please enter a valid URL.'
      }
    ])

    const response = await dpApi.createSite(answers.siteName, answers.siteUrl)

    console.log(chalk.green('Site created successfully!'))
    console.log(`Site ID: ${response.data.id}`)
    console.log(`Site URL: ${response.data.url}`)
  } catch (error) {
    console.error(chalk.red('Error creating site:'), error.message)
  }
}

module.exports = createSite
