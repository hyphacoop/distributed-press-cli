const axios = require('axios')
const chalk = require('chalk')
const config = require('../config/config')

async function cloneSite (siteId) {
  try {
    console.log(chalk.blue(`Cloning site with ID: ${siteId}`))

    const cloneUrl = `${config.dpApiUrl}/sites/${encodeURIComponent(siteId)}/clone`

    const response = await axios.post(cloneUrl, null, {
      headers: {
        Authorization: `Bearer ${config.authToken}`,
        'Content-Type': 'application/json'
      }
    })

    console.log(chalk.green('Site cloned successfully!'))
    console.log(`Cloned Site Info: ${JSON.stringify(response.data, null, 2)}`)
  } catch (error) {
    if (error.response) {
      console.error(chalk.red('Error cloning site:'), `Status: ${error.response.status}, Message: ${error.response.statusText}`)
      if (error.response.data) {
        console.error(chalk.red('Response Data:'), JSON.stringify(error.response.data, null, 2))
      }

      if (error.response.status === 500 && error.response.data && error.response.data.message && error.response.data.message.includes('The certificate is NOT trusted')) {
        console.error(chalk.yellow('Hint:'), 'It appears that the server is unable to clone your site due to an SSL certificate trust issue. Please ensure your domain has a valid, trusted SSL certificate that matches your domain name.')
      }
    } else {
      console.error(chalk.red('Error cloning site:'), error.message)
    }
  }
}

module.exports = cloneSite
