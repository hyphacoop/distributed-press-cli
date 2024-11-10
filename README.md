# Distributed Press CLI

A **Command Line Interface (CLI)** for interacting with the Distributed Press API and Social Inbox. Manage your sites, register your ActivityPub actor, and engage with followers seamlessly from the command line.

## Table of Contents

- [Installation](#installation)
  - [Node.js and npm Setup](#nodejs-and-npm-setup)
- [Setup](#setup)
  - [Generate a Keypair](#generate-a-keypair)
  - [Set Your Authentication Token](#set-your-authentication-token)
  - [Register Your Actor](#register-your-actor)
- [Configuration](#configuration)
- [Usage](#usage)
  - [Send a Post to Followers](#send-a-post-to-followers)
- [Commands](#commands)
  - [`generate-keypair`](#generate-keypair)
  - [`set-auth-token`](#set-auth-token)
  - [`register-actor`](#register-actor)
  - [`send-post`](#send-post)
- [Examples](#examples)
- [License](#license)
- [Resources](#resources)

## Installation

### Node.js and npm Setup

To use `dp-cli`, you’ll need Node.js and npm. Please refer to the [Node.js official documentation](https://nodejs.org/) to install Node.js. Once installed, npm (Node Package Manager) will be available, allowing you to run commands like `npx` and `npm`.

- **npm**: Comes bundled with Node.js. Verify installation by running:
  ```bash
  node -v
  npm -v
  ```

For additional help with npm commands, see the [npm documentation](https://docs.npmjs.com/).

### Using npx

You can use `dp-cli` without installation by running:

```bash
npx dp-cli <command>
```

### Global Installation with npm

To install `dp-cli` globally, use:

```bash
npm install -g dp-cli
```

Once installed, you can use `dp-cli` from anywhere in your terminal.

## Setup

Before using the CLI, you need to generate a keypair, set your authentication token, and register your ActivityPub actor.

### Generate a Keypair

Run the following command to generate a new RSA keypair:

```bash
dp-cli generate-keypair
```

**Purpose:**  
This keypair is used for authenticating your interactions with the Social Inbox, ensuring secure communication and verifying your identity.

**Note:**  
If you only plan to use the DP API for static file publishing, generating a keypair might not be necessary. However, it's recommended for enhanced security and functionality when interacting with the Social Inbox.

This will generate a keypair and save it to your `.dprc` configuration file.

### Register as Publisher (Trial Account)

Register a trial publisher account on Distributed Press using your email:

```bash
dp-cli register-publisher
```

You will be prompted for your name and email. Note: currently, only one site per email is allowed.

### OR Set Your Authentication Token Manually

Obtain your `authToken` from your Distributed Press API administrator and set it using:

```bash
dp-cli set-auth-token
```

You will be prompted to enter your authentication token.

### Register Your Actor

Register your ActivityPub actor with the Social Inbox:

```bash
dp-cli register-actor
```

**Prompts:**

1. **Enter your actor username:**  
   _(e.g., "@username@yourdomain.com")_

2. **Enter your actor URL:**  
   _(e.g., "https://yourdomain.com/actor")_

3. **Enter your public key ID:**  
   _(e.g., "https://yourdomain.com/actor#main-key")_

This will register your actor with the Social Inbox and save the details to your configuration.

## Configuration

The CLI uses a configuration file named `.dprc` to store API URLs, authentication tokens, keypairs, and actor information. The configuration file follows the format expected by the [`rc` module](https://www.npmjs.com/package/rc), which loads configuration options in a flexible way.

### Configuration File Structure

Your `.dprc` file should look like this:

```json
{
  "dpApiUrl": "https://api.distributed.press/v1",
  "socialInboxUrl": "https://social.distributed.press/v1",
  "authToken": "<your-auth-token>",
  "keypair": {
    "publicKeyPem": "<your-public-key>",
    "privateKeyPem": "<your-private-key>"
  },
  "actorUsername": "<your-actor-username>",
  "actorUrl": "<your-actor-url>",
  "publicKeyId": "<your-public-key-id>"
}
```

- **`dpApiUrl`:** The base URL for the Distributed Press API.
- **`socialInboxUrl`:** The base URL for the Social Inbox.
- **`authToken`:** Your authentication token for API access.
- **`keypair`:** Your public and private keys for secure interactions.
- **`actorUsername`:** Your ActivityPub actor username.
- **`actorUrl`:** The URL of your actor.
- **`publicKeyId`:** The ID of your public key.

_Ensure that your `.dprc` file is **not** committed to version control to keep your credentials secure._

## Usage

Once installed and configured, you can use the `dp-cli` command followed by specific commands to interact with the APIs.

### Send a Post to Followers

Publish a post to your followers:

```bash
dp-cli send-post --message "Hello, Fediverse!"
```

**Output:**

```
Sending a post to followers...
Post sent successfully!
Response: { ... }
```

## Commands

### `generate-keypair`

**Description:**  
Generate a new RSA keypair and save it to your configuration.

**Usage:**

```bash
dp-cli generate-keypair
```

### `register-publisher`

Register a trial publisher account with Distributed Press:

```bash
dp-cli register-publisher
```

### `set-auth-token`

**Description:**  
Set your authentication token for API access.

**Usage:**

```bash
dp-cli set-auth-token
```

**Prompt:**

- Enter your authentication token.

### `register-actor`

**Description:**  
Register your ActivityPub actor with the Social Inbox.

**Usage:**

```bash
dp-cli register-actor
```

**Prompts:**

- Enter your actor username.
- Enter your actor URL.
- Enter your public key ID.

### `send-post`

Send an activity post to your followers and publish it on the DP site:

```bash
dp-cli send-post --path ./path_to_activity.json
```

### `publish-site`

Upload and publish static content to the DP site from a specified directory:

```bash
dp-cli publish ./folder_here
```

### `clone-site`

Clone a website by creating a static copy from its HTTP URL:

```bash
dp-cli clone-site --id <site-id>
```

## Examples

### Example: Full Workflow

```bash
# Register as a publisher
dp-cli register-publisher
```

_Prompts:_

```
Enter your name: Alice
Enter your email: alice@example.com
```

```bash
# Generate a keypair
dp-cli generate-keypair
```

```bash
# Set your authentication token
dp-cli set-auth-token
```

_Prompt:_

```
Enter your authentication token:
```

```bash
# Register your actor
dp-cli register-actor
```

_Prompts:_

```
Enter your actor username: @alice@yourdomain.com
Enter your actor URL: https://yourdomain.com/alice
Enter your public key ID: https://yourdomain.com/alice#main-key
```

```bash
# Publish site content from a folder
dp-cli publish ./folder_here
```

```bash
# Send a post to followers with activity JSON
dp-cli send-post --path ./path_to_activity.json
```

## License

This project is licensed under the [MIT License](LICENSE).

## Resources

- **Distributed Press Documentation:**  
  [https://docs.distributed.press/](https://docs.distributed.press/)

- **Social Inbox Documentation:**  
  [https://github.com/hyphacoop/social.distributed.press](https://github.com/hyphacoop/social.distributed.press)

- **RC Module Documentation:**  
  [https://www.npmjs.com/package/rc](https://www.npmjs.com/package/rc)

- **HTTP Signed Fetch:**  
  [https://www.npmjs.com/package/http-signed-fetch](https://www.npmjs.com/package/http-signed-fetch)

- **Setting Up Node.js**:  
  [https://nodejs.org/en/download/](https://nodejs.org/en/download/)

## Notes

- **Security:** Ensure that your `.dprc` file and any keys or tokens are stored securely and are not exposed publicly.
- **Dependencies:** Make sure you have the necessary dependencies installed as per the `package.json` file.
