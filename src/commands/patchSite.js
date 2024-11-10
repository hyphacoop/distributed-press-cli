const fs = require('fs')
const path = require('path')
const tar = require('tar')
const axios = require('axios')
const chalk = require('chalk')
const config = require('../config/config')

async function loadGlobby () {
  const globbyModule = await import('globby')
  return globbyModule.globby || globbyModule.default || globbyModule
}

async function patchSite (folder, siteId) {
  try {
    if (!siteId) {
      console.error(chalk.red('Site ID is required to patch a site.'))
      return
    }

    console.log(chalk.blue('Patching site...'))

    // Validate folder
    if (!fs.existsSync(folder)) {
      console.error(chalk.red(`Folder "${folder}" does not exist.`))
      return
    }

    // Load globby dynamically
    const globby = await loadGlobby()

    // Create a tarball of the folder
    const tarballPath = path.join(process.cwd(), 'site-patch.tar')
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
    const response = await axios.patch(`${config.dpApiUrl}/sites/${siteId}`, tarballData, {
      headers: {
        'Content-Type': 'application/gzip',
        Authorization: `Bearer ${config.authToken}`
      }
    })

    console.log(chalk.green('Site patched successfully!'))
    console.log(`Updated Site Info: ${JSON.stringify(response.data, null, 2)}`)

    // Clean up the tarball
    fs.unlinkSync(tarballPath)
  } catch (error) {
    console.error(chalk.red('Error patching site:', error.message))
  }
}

module.exports = patchSite
