const axios = require('axios')
const chalk = require('chalk')
const config = require('../config/config')

async function cloneSite (siteId) {
  try {
    console.log(chalk.blue(`Cloning site with ID: ${siteId}`))

    const response = await axios.post(
      `${config.dpApiUrl}/sites/${siteId}/clone`,
      {},
      {
        headers: {
          Authorization: `Bearer ${config.authToken}`
        }
      }
    )

    console.log(chalk.green('Site cloned successfully!'))
    console.log(`Cloned Site Info: ${JSON.stringify(response.data, null, 2)}`)
  } catch (error) {
    console.error(chalk.red('Error cloning site:', error.message))
  }
}

module.exports = cloneSite
