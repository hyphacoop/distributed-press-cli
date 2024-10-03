# Distributed Press CLI

A **Command Line Interface (CLI)** for interacting with the Distributed Press API and Social Inbox. Manage your sites, register them with Social Inbox, and engage with followers seamlessly from the command line.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
  - [Create a New Site](#create-a-new-site)
  - [Register Site with Social Inbox](#register-site-with-social-inbox)
  - [Send a Post to Followers](#send-a-post-to-followers)
- [Commands](#commands)
- [Examples](#examples)
- [License](#license)
- [Resources](#resources)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/hyphacoop/distributed-press-cli.git
cd distributed-press-cli
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Make the CLI Globally Accessible

To use `dp-cli` from anywhere in your terminal, link the package globally:

```bash
npm link
```

*Note: You might need administrative privileges to run the above command.*

## Configuration

The CLI uses a configuration file named `.dprc` to store API URLs, authentication tokens, and keypairs. Here's how to set it up:

### 1. Create the `.dprc` File

Copy the example configuration file to your home directory:

- **Unix/Linux/macOS:**

  ```bash
  cp .dprc.example ~/.dprc
  ```

- **Windows (PowerShell):**

  ```powershell
  Copy-Item .dprc.example $env:USERPROFILE\.dprc
  ```

### 2. Edit the `.dprc` File

Open the `.dprc` file in your preferred text editor and replace the placeholder values with your actual configuration:

```json
{
  "dpApiUrl": "https://api.distributed.press",
  "socialInboxUrl": "https://social.distributed.press",
  "authToken": "your-auth-token",
  "keypair": {
    "publicKey": "your-public-key",
    "privateKey": "your-private-key"
  }
}
```

- **`dpApiUrl`:** The base URL for the Distributed Press API.
- **`socialInboxUrl`:** The base URL for the Social Inbox.
- **`authToken`:** Your authentication token for API access.
- **`keypair`:** Your public and private keys for secure interactions.

*Ensure that your `.dprc` file is **not** committed to version control to keep your credentials secure.*

## Usage

Once installed and configured, you can use the `dp-cli` command followed by specific commands to interact with the APIs.

### Create a New Site

Initialize a new site on Distributed Press.

```bash
dp-cli create-site
```

**Prompts:**

1. **Enter your site name:**  
   *(e.g., "My Awesome Site")*

2. **Enter your site URL:**  
   *(e.g., "https://myawesomesite.com")*

**Output:**

```
Creating a new site on Distributed Press...
Site created successfully!
Site ID: 12345
Site URL: https://myawesomesite.com
```

### Register Site with Social Inbox

Register your newly created site with the Social Inbox.

```bash
dp-cli register-site
```

**Prompts:**

1. **Select a site to register:**  
   *(List of your created sites)*

**Output:**

```
Registering site with Social Inbox...
Site registered with Social Inbox successfully!
Registration ID: abcde-12345
```

### Send a Post to Followers

Publish a post to your followers.

```bash
dp-cli send-post --message "Hello, Fediverse!"
```

**Prompts:**

1. **Select a site to send a post from:**  
   *(List of your registered sites)*

**Output:**

```
Sending a post to followers...
Post sent successfully!
Post ID: post-67890
```

## Commands

Here's a summary of the available commands in the Distributed Press CLI:

### `create-site`

**Description:**  
Create a new site on Distributed Press.

**Usage:**

```bash
dp-cli create-site
```

**Prompts:**

- Enter your site name.
- Enter your site URL.

### `register-site`

**Description:**  
Register an existing site with the Social Inbox.

**Usage:**

```bash
dp-cli register-site
```

**Prompts:**

- Select a site to register.

### `send-post`

**Description:**  
Send a post to your followers.

**Usage:**

```bash
dp-cli send-post --message "Your message here"
```

**Options:**

- `-m, --message <message>`: The content of the post.

**Prompts:**

- Select a site to send the post from.

## Examples

### Example 1: Creating and Registering a Site

```bash
# Create a new site
dp-cli create-site
```

*Prompts:*

```
Enter your site name: My Awesome Site
Enter your site URL: https://myawesomesite.com
```

*Output:*

```
Creating a new site on Distributed Press...
Site created successfully!
Site ID: 12345
Site URL: https://myawesomesite.com
```

```bash
# Register the newly created site with Social Inbox
dp-cli register-site
```

*Prompts:*

```
Select a site to register:
> My Awesome Site (https://myawesomesite.com)
```

*Output:*

```
Registering site with Social Inbox...
Site registered with Social Inbox successfully!
Registration ID: abcde-12345
```

### Example 2: Sending a Post

```bash
# Send a post to followers
dp-cli send-post --message "Hello, Fediverse!"
```

*Prompts:*

```
Select a site to send a post from:
> My Awesome Site (https://myawesomesite.com)
```

*Output:*

```
Sending a post to followers...
Post sent successfully!
Post ID: post-67890
```

## License

This project is licensed under the [MIT License](LICENSE).

## Resources

- **Social Inbox:**  
  [https://github.com/hyphacoop/social.distributed.press](https://github.com/hyphacoop/social.distributed.press)

- **Distributed Press Documentation:**  
  [https://docs.distributed.press/](https://docs.distributed.press/)
