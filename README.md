# Luo Xiaohei

## 📜 Description
Welcome to the project! This project leverages various npm scripts for linting, formatting, cleaning, building, managing commands, and starting the application.

## 📖 Table of Contents
1. [Installation](#installation)
2. [Scripts](#scripts)
3. [Usage](#usage)

## 🚀 Installation
Follow these steps to get started:
1. Clone the repository:
    ```sh
    git clone https://github.com/lxhapp/luoxiaohei.git
    ```
2. Navigate to the project directory:
    ```sh
    cd luoxiaohei
    ```
3. Install the dependencies:
    ```sh
    npm install
    ```

## 🛠️ Scripts
Here are the npm scripts you can use:

### Linting 🧹
- `npm run lint`: Runs ESLint on the project.
- `npm run lint:fix`: Runs ESLint and automatically fixes issues.

### Formatting ✨
- `npm run format`: Checks formatting with Prettier.
- `npm run format:fix`: Automatically formats code with Prettier.

### Cleaning 🧼
- `npm run clean`: Cleans the repository, excluding certain files.
- `npm run clean:dry`: Performs a dry run of the clean process.

### Building 🛠️
- `npm run build`: Compiles the TypeScript project.

### Command Management ⚙️
- `npm run commands:view`: View the commands.
- `npm run commands:register`: Register new commands.
- `npm run commands:rename`: Rename existing commands.
- `npm run commands:delete`: Delete commands.
- `npm run commands:clear`: Clear all commands.

### Starting the Application 🚀
- `npm run start`: Starts the application.
- `npm run start:app`: Builds and starts the application.
- `npm run start:manager`: Builds and starts the manager.
- `npm run start:pm2`: Builds and starts the application using PM2.

### PM2 Management 🖥️
- `npm run pm2:start`: Starts the PM2 process.
- `npm run pm2:stop`: Stops the PM2 process.
- `npm run pm2:delete`: Deletes the PM2 process.

## 💡 Usage
To use the npm scripts, you can run them with `npm run <script-name>`. For example, to lint your code, run:
```sh
npm run lint