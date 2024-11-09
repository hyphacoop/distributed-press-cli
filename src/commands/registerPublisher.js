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
        message: 'Enter your name or publisher name:',
        validate: (input) => (input ? true : 'Name cannot be empty.')
      },
      {
        type: 'input',
        name: 'email',
        message: 'Enter your email address:',
        validate: (input) =>
          /\S+@\S+\.\S+/.test(input) ? true : 'Please enter a valid email address.'
      }
    ])

    console.log(chalk.blue('Registering for a trial account...'))

    const response = await axios.post(`${config.dpApiUrl}/publisher/trial`, {
      name: answers.name,
      email: answers.email,
      limited: true
    })

    const authToken = response.data.authToken

    // Save authToken to config
    config.authToken = authToken

    // Write updated config to .dprc
    const configPath = path.join(process.cwd(), '.dprc')
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2))

    console.log(chalk.green('Trial account registered successfully!'))
    console.log(chalk.green('Authentication token saved to configuration.'))
  } catch (error) {
    console.error(chalk.red('Error registering trial account:', error.message))
  }
}

module.exports = registerPublisher
