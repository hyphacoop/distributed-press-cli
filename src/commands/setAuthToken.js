const inquirer = require('inquirer')
const config = require('../config/config')
const chalk = require('chalk')
const fs = require('fs')
const path = require('path')

function setAuthTokenCommand () {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'authToken',
        message: 'Enter your authentication token:',
        validate: (input) => (input ? true : 'Authentication token cannot be empty.')
      }
    ])
    .then((answers) => {
      config.authToken = answers.authToken

      // Write to .dprc file
      const configPath = path.join(process.cwd(), '.dprc')
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2))

      console.log(chalk.green('Authentication token saved to configuration.'))
    })
    .catch((error) => {
      console.error(chalk.red('Failed to set authentication token:'), error.message)
    })
}

module.exports = setAuthTokenCommand
