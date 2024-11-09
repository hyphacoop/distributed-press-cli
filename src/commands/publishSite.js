const fs = require('fs')
const path = require('path')
const tar = require('tar')
const axios = require('axios')
const globby = require('globby')
const chalk = require('chalk')
const config = require('../config/config')

async function publishSite (folder) {
  try {
    console.log(chalk.blue('Publishing site...'))

    // Validate folder
    if (!fs.existsSync(folder)) {
      console.error(chalk.red(`Folder "${folder}" does not exist.`))
      return
    }

    // Create a tarball of the folder
    const tarballPath = path.join(process.cwd(), 'site.tar')
    await tar.c(
      {
        gzip: true,
        file: tarballPath,
        cwd: folder
      },
      await globby(['**/*'], { cwd: folder })
    )

    // Read the tarball
    const tarballData = fs.createReadStream(tarballPath)

    // Send the tarball to the API
    const response = await axios.post(`${config.dpApiUrl}/sites`, tarballData, {
      headers: {
        'Content-Type': 'application/gzip',
        Authorization: `Bearer ${config.authToken}`
      }
    })

    console.log(chalk.green('Site published successfully!'))
    console.log(`Site ID: ${response.data.id}`)
    console.log(`Links: ${JSON.stringify(response.data.links, null, 2)}`)

    // Clean up the tarball
    fs.unlinkSync(tarballPath)
  } catch (error) {
    console.error(chalk.red('Error publishing site:', error.message))
  }
}

module.exports = publishSite
