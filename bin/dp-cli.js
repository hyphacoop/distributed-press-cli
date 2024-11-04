#!/usr/bin/env node
const { Command } = require('commander')
const chalk = require('chalk')
const createSite = require('../src/commands/createSite')
const registerActor = require('../src/commands/registerActor')
const sendPost = require('../src/commands/sendPost')
const generateKeypairCommand = require('../src/commands/generateKeypair')
const setAuthTokenCommand = require('../src/commands/setAuthToken')

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

// Parse arguments
program.parse(process.argv)

// Show help if no arguments are provided
if (!process.argv.slice(2).length) {
  program.outputHelp()
}
