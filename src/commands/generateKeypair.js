const { generateKeyPairSync } = require('crypto')
const fs = require('fs')
const path = require('path')
const config = require('../config/config')
const chalk = require('chalk')

function generateKeypairCommand () {
  try {
    const { publicKey, privateKey } = generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    })

    // Save the keypair to config
    config.keypair = {
      publicKeyPem: publicKey,
      privateKeyPem: privateKey
    }

    // Optionally, write to .dprc file
    const configPath = path.join(process.cwd(), '.dprc')
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2))

    console.log(chalk.green('Keypair generated and saved to configuration.'))
  } catch (error) {
    console.error(chalk.red('Failed to generate keypair:'), error.message)
  }
}

module.exports = generateKeypairCommand