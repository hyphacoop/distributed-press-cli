# Distributed Press CLI

A **Command Line Interface (CLI)** for interacting with the Distributed Press API and Social Inbox. Manage your sites, register your ActivityPub actor, and engage with followers seamlessly from the command line.

## Table of Contents

- [Installation](#installation)
  - [Node.js and npm Setup](#nodejs-and-npm-setup)
- [Distributed Press Setup](#distributed-press-setup)
  - [Register as Publisher (Trial Account)](#register-as-publisher-trial-account)
  - [Set Your Authentication Token](#set-your-authentication-token)
  - [Create Your Site](#create-your-site)
  - [Publish Your Site](#publish-your-site)
  - [DNS Setup](#dns-setup)
  - [Clone an Existing Site](#clone-an-existing-site)
- [Social Inbox Setup](#social-inbox-setup-send-posts-to-fediverse)
  - [Generate a Keypair](#generate-a-keypair)
  - [Register Your Actor](#register-your-actor)
  - [Send a Post to Followers](#send-a-post-to-followers)
- [Configuration](#configuration)
- [Commands](#commands)
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

## Distributed Press Setup

### Register as Publisher (Trial Account)

Register a trial publisher account on Distributed Press using your email:

```bash
dp-cli register
```

You will be prompted for your name and email. Note: currently, only one site per email is allowed.

### OR Set Your Authentication Token Manually

Obtain your `authToken` from your Distributed Press API administrator and set it using:

```bash
dp-cli set-auth-token
```

You will be prompted to enter your authentication token.

### Create Your Site

Once registered, create a new site by specifying the domain name and whether it should be public:

```bash
dp-cli create-site
```

### Publish Your Site

To upload and publish static content to the DP site from a specified directory:

```bash
dp-cli publish ./folder_here
```

### DNS Setup

To use a custom domain for your Distributed Press site, you'll need to set up a DNS record to point to the Distributed Press infrastructure.

#### Using Distributed Press Infrastructure
- If you wish to use the official Distributed Press instance for your HTTPS traffic, [contact](mailto:hello@distributed.press) the Distributed Press team.
- Alternatively, refer to the [documentation for self-hosting](https://docs.distributed.press/self-hosting/) for guidance on running your own infrastructure.

### CNAME Record

| Type  | Name          | Value                    |
| ----- | ------------- | ------------------------ |
| CNAME | `<your-site>` | `api.distributed.press.` |

- Replace `your-site`` with your domain or subdomain name.
- Ensure that the trailing dot `.` is included in `api.distributed.press.` as required.

### _dnslink Record

To make your site accessible through Distributed Press, set an `NS Record` to delegate DNSLink lookups to Distributed Press.

| Type | Name                   | Value                              |
| ---- | ---------------------- | ---------------------------------- |
| NS  | `_dnslink` | `api.distributed.press.`   |

- This eliminates the need to manually set TXT records.
- [contact](mailto:hello@distributed.press) the Distributed Press team for assistance if needed.

### Example

If your site links include:

```json
"ipfs": {
  "dnslink": "/ipns/k51qzi5uqu5djj6yo1nne5r2oomxgroy3tezhgupvx0v2jlbighfah1k028sc1/"
},
"hyper": {
  "dnslink": "/hyper/t685fd3snbadhqkss8spcgz454p95ap77kdfjafotsxfhhrhuqio/"
}
```

You only need to configure the `NS Record` as shown above. DNSLink propagation will handle IPFS and Hyper links automatically.

After DNS propagation, users will be able to access the site at `example.com` over IPFS and Hyper.
- ipns://example.com
- hyper://example.com

### SSL Requirements
To use your custom domain, ensure that your domain has a valid HTTPS certificate. Most DNS providers offer free certificate generation via [Let's Encrypt](https://letsencrypt.org/) or similar services.

## Clone an Existing Site

Clone a website by creating a static copy from its HTTP URL:

```bash
dp-cli clone <site-id>
```

## Social Inbox Setup (Send Posts to Fediverse)

For using the Social Inbox, you need to generate a keypair and register your ActivityPub actor.

### Generate a Keypair

Run the following command to generate a new RSA keypair:

```bash
dp-cli generate-keypair
```

**Purpose:**  
This keypair is used for authenticating your interactions with the Social Inbox and the fediverse at large, ensuring secure communication and verifying your identity.

**Note:**  
If you only plan to use the DP API for static file publishing, generating a keypair might not be necessary. However, it's recommended for enhanced security and functionality when interacting with the Social Inbox.

This will generate a keypair and save it to your `.dprc` configuration file.

### Register Your Actor

Register your ActivityPub actor with the Social Inbox:

```bash
dp-cli register-actor
```

This will register your actor with the Social Inbox and save the details to your configuration.

## Configuration

The CLI uses a configuration file named `.dprc` to store API URLs, authentication tokens, keypairs, and actor information. The configuration file follows the format expected by the [`rc` module](https://www.npmjs.com/package/rc), which loads configuration options in a flexible way.

### Send a Post to Followers

Publish a post to your followers:

```bash
dp-cli send-post --path ./path_to_activity.json
```

### Configuration

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
  "domain": "<your-site-domain>",
  "actorUsername": "<your-actor-username>",
  "actorUrl": "<your-actor-url>",
  "publicKeyId": "<your-public-key-id>"
}
```

- **`dpApiUrl`:** The base URL for the Distributed Press API.
- **`socialInboxUrl`:** The base URL for the Social Inbox.
- **`authToken`:** Your authentication token for API access.
- **`keypair`:** Your public and private keys for secure interactions.
- **`domain`:** Your custom domain for the site, e.g., example.com.
- **`actorUsername`:** Your ActivityPub actor username.
- **`actorUrl`:** The URL of your actor.
- **`publicKeyId`:** The ID of your public key.

_Ensure that your `.dprc` file is **not** committed to version control to keep your credentials secure._

## Commands

### `register`

**Description:**

Register a trial publisher account with Distributed Press:

**Usage:**

```bash
dp-cli register
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

### `create-site`

**Description:**

Create a new site by specifying the domain name and whether it should be public

**Usage:**

```bash
dp-cli create-site
```

**Prompt:**

- **Enter your site domain**: e.g., `example.com`
- **Is your site public?** _(Yes/No)_

### `publish-site`

**Description:**

Upload and publish static content to the DP site from a specified directory:

**Usage:**

```bash
dp-cli publish ./folder_here
```

### `clone`

**Description:**

Clone a website by creating a static copy from its HTTP URL:

**Usage:**

```bash
dp-cli clone <site-id>
```

### `generate-keypair`

**Description:**  
Generate a new RSA keypair and save it to your configuration.

**Usage:**

```bash
dp-cli generate-keypair
```

### `register-actor`

**Description:**  
Register your ActivityPub actor with the Social Inbox.

**Usage:**

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

### `send-post`

Send an activity post to your followers and publish it on the DP site:

```bash
dp-cli send-post --path ./path_to_activity.json
```

**Output:**

```
Sending a post to followers...
Post sent successfully!
Response: { ... }
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
