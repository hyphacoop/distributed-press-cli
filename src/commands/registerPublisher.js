const inquirer = require('inquirer')
const axios = require('axios')
const chalk = require('chalk')
const config = require('../config/config')
const fs = require('fs')
const path = require('path')

async function registerPublisher () {
  try {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Enter your email:',
        validate: (input) => (input ? true : 'Email cannot be empty.')
      }
    ])

    console.log(chalk.blue('Registering for a trial account...'))

    const response = await axios.post(`${config.dpApiUrl}/publisher/trial`, {
      name: answers.name,
      limited: true
    })

    const authToken = response.data

    // Save authToken to config
    config.authToken = authToken

    // Create a cleaned config object excluding unwanted properties
    const { _, configs, config: configPath, ...cleanConfig } = config

    // Write updated config to .dprc
    const configFilePath = path.join(process.cwd(), '.dprc')
    fs.writeFileSync(configFilePath, JSON.stringify(cleanConfig, null, 2))

    console.log(chalk.green('Trial account registered successfully!'))
    console.log(chalk.green('Authentication token saved to configuration.'))
  } catch (error) {
    console.error(
      chalk.red('Error registering trial account:'),
      error.response ? error.response.data : error.message
    )
  }
}

module.exports = registerPublisher
