const inquirer = require('inquirer')
const socialInboxApi = require('../api/socialInboxApi')
const chalk = require('chalk')
const config = require('../config/config')
const fs = require('fs')
const path = require('path')

async function registerActor () {
  try {
    console.log(chalk.blue('Registering your actor with the Social Inbox...'))

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'actorUsername',
        message: 'Enter your actor username (e.g., @username@domain.com):',
        validate: (input) => (input ? true : 'Actor username cannot be empty.')
      },
      {
        type: 'input',
        name: 'actorUrl',
        message: 'Enter your actor URL:',
        validate: (input) =>
          /^https?:\/\/.+/.test(input) ? true : 'Please enter a valid URL.'
      },
      {
        type: 'input',
        name: 'publicKeyId',
        message: 'Enter your public key ID (e.g., https://domain.com/actor#main-key):',
        validate: (input) => (input ? true : 'Public key ID cannot be empty.')
      }
    ])

    // Save actor info to config
    config.actorUsername = answers.actorUsername
    config.actorUrl = answers.actorUrl
    config.publicKeyId = answers.publicKeyId

    // Create a cleaned config object excluding unwanted properties
    const { _, configs, config: configPath, ...cleanConfig } = config

    // Write updated config to .dprc
    const configFilePath = path.join(process.cwd(), '.dprc')
    fs.writeFileSync(configFilePath, JSON.stringify(cleanConfig, null, 2))

    const actorInfo = {
      actorUrl: answers.actorUrl,
      publicKeyId: answers.publicKeyId,
      keypair: config.keypair
    }

    // Register actor with Social Inbox
    const response = await socialInboxApi.registerActor(answers.actorUsername, actorInfo)

    console.log(chalk.green('Actor registered with Social Inbox successfully!'))
    console.log(`Response: ${JSON.stringify(response.data, null, 2)}`)
  } catch (error) {
    console.error(chalk.red('Error registering actor:'), error.message)
  }
}

module.exports = registerActor
