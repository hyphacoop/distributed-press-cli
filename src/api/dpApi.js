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
async function createSite (domain, isPublic = true, protocols = { http: true, hyper: true, ipfs: true }) {
  try {
    const payload = {
      domain,
      public: isPublic,
      protocols
    }
    const response = await dpApiClient.post('/sites', payload)
    return response
  } catch (error) {
    console.error(chalk.red('DP API Error:', error.response ? error.response.data : error.message))
    throw error
  }
}

// Get all sites
async function getSites () {
  try {
    const response = await dpApiClient.get('/sites')
    return response
  } catch (error) {
    console.error(chalk.red('DP API Error:', error.response ? error.response.data : error.message))
    throw error
  }
}

module.exports = {
  createSite,
  getSites
}
