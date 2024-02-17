## Node.js Installation

### Install Node.js on Ubuntu:
- Update package list:
  ```bash
  sudo apt update
  ```
- Install Node.js (Example for Node.js v14):
  ```bash
  curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
  sudo apt-get install -y nodejs
  ```

### Install a specific version of Node.js (e.g., Node.js v19):
- Remove older versions of Node.js:
  ```bash
  sudo apt remove nodejs npm
  ```
- Install Node.js v19:
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_19.x | sudo -E bash -
  sudo apt-get install -y nodejs
  ```

## FFmpeg Installation

### Install FFmpeg on Ubuntu:
- Update your package list and install FFmpeg:
  ```bash
  sudo apt update
  sudo apt install ffmpeg
  ```

## Setting up Password-less SSH Access

### Generate and copy SSH keys:
- Generate a new SSH key pair:
  ```bash
  ssh-keygen
  ```
- Copy the public key to your server:
  ```bash
  ssh-copy-id username@remoteHost
  ```

Replace `username` with your actual username on the remote host and `remoteHost` with the server's IP address or hostname.