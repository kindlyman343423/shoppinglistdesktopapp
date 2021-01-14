# Shopping List Desktop App

![shopping list app](./public/hello.gif)

Shopping List Desktop Application for different types of machines i.e Windows, MAC and linux.

## Features

* Adding new item to the list
* delete the wrong item that is added
* clear all the list

## Available Machines

* Linux
* Windows
* MAC

## Development

For starting the development with this project follow the below steps:

1. Firstly clone this project make sure you have 500MB space available because the dependencies are too larger.

2. Then run the command `yarn run init`. This command with initialize this project in your local machine that you can use to code your application.

3. For running the application in development mode run the command `yarn run dev`

## Contribution

For contributing to this desktop application project make sure you check our [Contributing Guidelines](.github/CONTRIBUTING.md)

## Available Scripts

In the project directory, you can run:

### `yarn run init`

Script for the developers to initialize this project in local

### `yarn run client`

Script to run the the react webpack dev server only.

### `yarn run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.

### `yarn run electron`

Script to run the electron static file server and the **entry point** `main` as mentioned in `package.json`

### `yarn run dev`

Script to run the application in the `development` environment

### `yarn run prod`

Script to run the application in the `production` environment

### Releasing this project

For releasing this project we have provided three scripts for all the 3 types of OS. But before releasing remember to uncomment the line `config.setNodeEnv('production')` in **electron/main.js**

#### `yarn run package-linux`

Script to be used only on linux platform to generate **.AppImage** file that can be used to directly from command line easily without installation

#### `yarn run package-win`

Script to be used only on windows platform to generate portable format **.exe** file that can be used directly in windows

#### `yarn run package-mac`

Script to be used only on mac platform to generate default file that can be used to directly from command line easily without installation

## LICENSE

[MIT LICENSE](LICENSE)
