const axios = require('axios')
const chalk = require('chalk')
const config = require('../config/config')
const path = require('path')

async function loadWebsiteScraper () {
  // Dynamically import the ES module `website-scraper`
  return await import('website-scraper')
}

async function cloneSite (siteId, outputDir) {
  try {
    console.log(chalk.blue(`Cloning site with ID: ${siteId}`))

    // Trigger server-side cloning
    await axios.post(`${config.dpApiUrl}/sites/${encodeURIComponent(siteId)}/clone`, null, {
      headers: {
        Authorization: `Bearer ${config.authToken}`,
        'Content-Type': 'application/json'
      },
      validateStatus: (status) => status >= 200 && status < 300
    })

    console.log(chalk.green('Server-side cloning initiated successfully!'))

    // Proceed to download the site content locally
    const outputDirectory = outputDir || path.join(process.cwd(), siteId)

    let siteUrl = siteId
    if (!siteUrl.startsWith('http://') && !siteUrl.startsWith('https://')) {
      siteUrl = `https://${siteUrl}`
    }

    console.log(chalk.blue(`Downloading site content from ${siteUrl} to ${outputDirectory}...`))

    // Dynamically load `website-scraper`
    const { default: scrape } = await loadWebsiteScraper()

    await scrape({
      urls: [siteUrl],
      directory: outputDirectory,
      recursive: true,
      maxRecursiveDepth: 10,
      urlFilter: (url) => url.startsWith(siteUrl)
    })

    console.log(chalk.green('Site content downloaded successfully!'))
    console.log(`Site content saved to: ${outputDirectory}`)
  } catch (error) {
    console.error(chalk.red('Error cloning site:'), error.message)
  }
}

module.exports = cloneSite
