const axios = require('axios')
const config = require('../config/config')
const chalk = require('chalk')

const socialInboxClient = axios.create({
  baseURL: config.socialInboxUrl,
  headers: {
    Authorization: `Bearer ${config.authToken}`,
    'Content-Type': 'application/json'
  }
})

// Register a site with Social Inbox
async function registerSite (siteId) {
  return await socialInboxClient.post('/register', { siteId })
}

// Send a post to followers
async function sendPost (siteId, message) {
  return await socialInboxClient.post('/posts', { siteId, message })
}

module.exports = {
  registerSite,
  sendPost
}
