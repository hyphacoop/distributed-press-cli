const axios = require('axios')
const chalk = require('chalk')
const config = require('../config/config')

async function cloneSite (siteId) {
  try {
    console.log(chalk.blue(`Cloning site with ID: ${siteId}`))

    // Trigger server-side cloning
    const cloneUrl = `${config.dpApiUrl}/sites/${encodeURIComponent(siteId)}/clone`
    await axios.post(cloneUrl, null, {
      headers: {
        Authorization: `Bearer ${config.authToken}`,
        'Content-Type': 'application/json'
      },
      validateStatus: (status) => status >= 200 && status < 300
    })

    console.log(chalk.green('Server-side cloning initiated successfully!'))

    // Fetch updated site info
    const siteInfoUrl = `${config.dpApiUrl}/sites/${encodeURIComponent(siteId)}`
    const response = await axios.get(siteInfoUrl, {
      headers: {
        Authorization: `Bearer ${config.authToken}`
      }
    })

    if (response.data && Object.keys(response.data).length > 0) {
      console.log(chalk.green('Cloned Site Info:'))
      console.log(JSON.stringify(response.data, null, 2))
    } else {
      console.log(chalk.yellow('No site information was returned by the API.'))
    }
  } catch (error) {
    handleCloneError(error)
  }
}

function handleCloneError (error) {
  if (error.response) {
    console.error(
      chalk.red('Error cloning site:'),
      `Status: ${error.response.status}, Message: ${error.response.statusText}`
    )
    if (error.response.data) {
      console.error(chalk.red('Response Data:'), JSON.stringify(error.response.data, null, 2))
    } else {
      console.error(chalk.red('No response data available.'))
    }

    if (
      error.response.status === 500 &&
      error.response.data &&
      error.response.data.message &&
      error.response.data.message.includes('The certificate is NOT trusted')
    ) {
      console.error(
        chalk.yellow('Hint:'),
        'It appears that the server is unable to clone your site due to an SSL certificate trust issue. Please ensure your domain has a valid, trusted SSL certificate that matches your domain name.'
      )
    }
  } else if (error.request) {
    console.error(chalk.red('No response received from the server.'))
    console.error(error.request)
  } else {
    console.error(chalk.red('Error setting up the request:'), error.message)
  }
}

module.exports = cloneSite
