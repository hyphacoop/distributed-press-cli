#!/usr/bin/env node
const { Command } = require('commander')
const chalk = require('chalk')
const createSite = require('../src/commands/createSite')
const registerActor = require('../src/commands/registerActor')
const sendPost = require('../src/commands/sendPost')
const generateKeypairCommand = require('../src/commands/generateKeypair')
const setAuthTokenCommand = require('../src/commands/setAuthToken')
const publishSite = require('../src/commands/publishSite')
const patchSite = require('../src/commands/patchSite')

const program = new Command()

program
  .name('dp-cli')
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
  $ dp-cli create-site
`)

program
  .command('register-actor')
  .description('Register your actor with the Social Inbox')
  .action(() => {
    registerActor()
  })

program
  .command('send-post')
  .description('Send a post to followers')
  .requiredOption('-m, --message <message>', 'Post message')
  .action((options) => {
    sendPost(options.message)
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
  .command('patch <folder>')
  .description('Update an existing site with content from the specified folder')
  .option('-i, --id <siteId>', 'ID of the site to patch')
  .action((folder, options) => {
    patchSite(folder, options.id)
  })

// Parse arguments
program.parse(process.argv)

// Show help if no arguments are provided
if (!process.argv.slice(2).length) {
  program.outputHelp()
}
