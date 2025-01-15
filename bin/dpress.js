#!/usr/bin/env node
const { Command } = require('commander')
const createSite = require('../src/commands/createSite')
const registerActor = require('../src/commands/registerActor')
const sendPost = require('../src/commands/sendPost')
const generateKeypairCommand = require('../src/commands/generateKeypair')
const setAuthTokenCommand = require('../src/commands/setAuthToken')
const publishSite = require('../src/commands/publishSite')
const patchSite = require('../src/commands/patchSite')
const registerPublisher = require('../src/commands/registerPublisher')
const cloneSite = require('../src/commands/cloneSite')

const program = new Command()

program
  .name('dpress')
  .description('CLI for interacting with Distributed Press API and Social Inbox')
  .version('1.0.0')

// Define commands
program
  .command('create-site')
  .description('Create a new site on Distributed Press')
  .action(() => {
    createSite()
  })
  .addHelpText('after', `
  
Examples:
  $ dpress create-site
`)

program
  .command('register-actor')
  .description('Register your actor with the Social Inbox')
  .action(() => {
    registerActor()
  })

program
  .command('send-post <activityPath>')
  .description('Send a post to followers using an activity JSON file')
  .action((activityPath) => {
    sendPost(activityPath)
  })

program
  .command('generate-keypair')
  .description('Generate a new RSA keypair')
  .action(generateKeypairCommand)

program
  .command('set-auth-token')
  .description('Set your authentication token')
  .action(() => {
    setAuthTokenCommand()
  })

program
  .command('publish <folder>')
  .description('Publish a new site with content from the specified folder')
  .action((folder) => {
    publishSite(folder)
  })

program
  .command('register')
  .description('Register for a trial publisher account')
  .action(() => {
    registerPublisher()
  })

program
  .command('patch <folder>')
  .description('Update an existing site with content from the specified folder')
  .option('-i, --id <siteId>', 'ID of the site to patch')
  .action((folder, options) => {
    patchSite(folder, options.id)
  })

program
  .command('clone <siteId>')
  .description('Clone a website from its HTTPS version')
  .action((siteId) => {
    cloneSite(siteId)
  })

// Parse arguments
program.parse(process.argv)

// Show help if no arguments are provided
if (!process.argv.slice(2).length) {
  program.outputHelp()
}
