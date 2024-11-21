const inquirer = require('inquirer')
const chalk = require('chalk')
const axios = require('axios')
const config = require('../config/config')

async function createSite () {
  try {
    console.log(chalk.blue('Creating a new site on Distributed Press...'))

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'domain',
        message: 'Enter your site domain (e.g., example.com):',
        validate: (input) => (input ? true : 'Domain cannot be empty.')
      },
      {
        type: 'confirm',
        name: 'isPublic',
        message: 'Is your site public?',
        default: true
      }
    ])

    // According to the DP API: domain is a string, public is boolean
    // The user input: domain, isPublic
    const payload = {
      domain: answers.domain,
      public: answers.isPublic,
      protocols: { http: true, hyper: true, ipfs: true } // default protocols
    }

    console.log(chalk.blue(`Sending payload to DP API: ${JSON.stringify(payload, null, 2)}`))

    const response = await axios.post(`${config.dpApiUrl}/sites`, payload, {
      headers: {
        Authorization: `Bearer ${config.authToken}`,
        'Content-Type': 'application/json'
      }
    })

    console.log(chalk.green('Site created successfully!'))
    console.log(`Site ID: ${response.data.id}`)
    console.log(`Site Info: ${JSON.stringify(response.data, null, 2)}`)
  } catch (error) {
    if (error.response && error.response.data) {
      console.error(chalk.red('DP API Error:'), JSON.stringify(error.response.data, null, 2))
    } else {
      console.error(chalk.red('Error creating site:'), error.message)
    }
  }
}

module.exports = createSite
