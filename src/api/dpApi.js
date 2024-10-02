const axios = require('axios')
const config = require('../config/config')
const chalk = require('chalk')

const dpApiClient = axios.create({
  baseURL: config.dpApiUrl,
  headers: {
    Authorization: `Bearer ${config.authToken}`,
    'Content-Type': 'application/json'
  }
})

// Create a new site
async function createSite (name, url) {
  try {
    const response = await dpApiClient.post('/sites', { name, url })
    return response
  } catch (error) {
    console.error(chalk.red('DP API Error:', error.response ? error.response.data : error.message))
    throw error
  }
}

// Get all sites
async function getSites () {
  return await dpApiClient.get('/sites')
}

module.exports = {
  createSite,
  getSites
}
