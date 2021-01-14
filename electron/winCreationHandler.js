const path = require('path');
const { BrowserWindow } = require('electron');
const config = require('../.erboilerplate/config');

const createAddWindow = (addWindow)=> {
    // create new window
    addWindow = new BrowserWindow({
        width: 500,
        height: 500,
        title: 'Add Shopping List Item',
        webPreferences: {
            nodeIntegration: false,     // is default value after Electron v5
            contextIsolation: true,     // protect against prototype pollution
            enableRemoteModule: false,  // turn off remote
            preload: path.join(__dirname, "preload.js") // use a preload script
        },
    });
    // load the add the component file
    addWindow.loadURL(
        process.env.NODE_ENV !== 'production'
            ? path.join(config.DEV_SERVER_URL,'add')
            : config.getProdServerURL('#/add')
    );

    addWindow.on('close', () => {
        addWindow = null;
    });
    return addWindow;
}

module.exports = {
    createAddWindow
}