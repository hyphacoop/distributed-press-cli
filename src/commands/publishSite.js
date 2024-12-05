const fs = require('fs')
const path = require('path')
const tar = require('tar')
const axios = require('axios')
const chalk = require('chalk')
const config = require('../config/config')
const inquirer = require('inquirer')
const FormData = require('form-data')

async function loadGlobby () {
  const globbyModule = await import('globby')
  return globbyModule.globby || globbyModule.default || globbyModule
}

async function publishSite (folder) {
  try {
    console.log(chalk.blue('Publishing site...'))

    // Validate folder
    if (!fs.existsSync(folder)) {
      console.error(chalk.red(`Folder "${folder}" does not exist.`))
      return
    }

    // Check if we have a domain in config or prompt for one
    let domain = config.domain
    if (!domain) {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'domain',
          message: 'Enter your site domain (e.g., example.com):',
          validate: (input) => (input ? true : 'Domain cannot be empty.')
        }
      ])
      domain = answers.domain
      config.domain = domain
      // Save domain to the `.dprc` file
      const { _, configs, config: configPath, ...cleanConfig } = config
      const configFilePath = path.join(process.cwd(), '.dprc')
      fs.writeFileSync(configFilePath, JSON.stringify(cleanConfig, null, 2))
    }

    // Load globby dynamically
    const globby = await loadGlobby()

    // Create a tarball of the folder
    const tarballPath = path.join(process.cwd(), 'site.tar.gz')
    await tar.c(
      {
        gzip: true,
        file: tarballPath,
        cwd: folder
      },
      await globby(['**/*'], { cwd: folder })
    )

    // Check if a site with this domain already exists
    // If a site doesn't exist, we need to create one first.
    let siteResponse
    try {
      siteResponse = await axios.get(`${config.dpApiUrl}/sites/${domain}`, {
        headers: {
          Authorization: `Bearer ${config.authToken}`
        }
      })
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // site does not exist, create it
        console.log(chalk.yellow(`Site with domain '${domain}' not found, creating a new site...`))
        const createSiteResponse = await axios.post(`${config.dpApiUrl}/sites`, {
          domain,
          public: true,
          protocols: { http: true, hyper: true, ipfs: true }
        }, {
          headers: {
            Authorization: `Bearer ${config.authToken}`,
            'Content-Type': 'application/json'
          }
        })
        siteResponse = createSiteResponse
      } else {
        throw error // rethrow any other error
      }
    }

    if (!siteResponse || !siteResponse.data) {
      console.error(chalk.red('Unable to find or create site for the specified domain.'))
      return
    }

    // Prepare multipart/form-data with the tarball
    const form = new FormData()
    form.append('file', fs.createReadStream(tarballPath), {
      filename: 'site.tar.gz',
      contentType: 'application/gzip'
    })

    // The server expects a PUT with multipart/form-data to /v1/sites/:id to upload site content
    const siteId = siteResponse.data.id || domain // The site ID or domain
    const publishUrl = `${config.dpApiUrl}/sites/${encodeURIComponent(siteId)}`
    const response = await axios.put(publishUrl, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${config.authToken}`
      }
    })

    // The server might return an empty response on success, so we attempt a new GET request to get updated site info:
    if (!response.data) {
      console.log(chalk.blue('Attempting to fetch updated site info...'))
      const updatedSiteInfoResponse = await axios.get(`${config.dpApiUrl}/sites/${encodeURIComponent(siteId)}`, {
        headers: {
          Authorization: `Bearer ${config.authToken}`
        }
      })
      console.log(chalk.green('Site published successfully!'))
      console.log(`Site ID: ${updatedSiteInfoResponse.data.id}`)
      console.log(`Links: ${JSON.stringify(updatedSiteInfoResponse.data.links, null, 2)}`)
    } else {
      console.log(chalk.green('Site published successfully!'))
      console.log(`Response: ${JSON.stringify(response.data, null, 2)}`)
      // If the response contains these fields, print them. Otherwise ignore
      if (response.data.id) {
        console.log(`Site ID: ${response.data.id}`)
      }
      if (response.data.links) {
        console.log(`Links: ${JSON.stringify(response.data.links, null, 2)}`)
      }
    }

    // Clean up the tarball
    fs.unlinkSync(tarballPath)
  } catch (error) {
    if (error.response && error.response.data) {
      console.error(chalk.red('Error publishing site:'), JSON.stringify(error.response.data))
    } else {
      console.error(chalk.red('Error publishing site:'), error.message)
    }
  }
}

module.exports = publishSite
