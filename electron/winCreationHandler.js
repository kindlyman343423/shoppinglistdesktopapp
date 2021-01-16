const path = require('path');
const { BrowserWindow, Menu } = require('electron');
const config = require('../.erboilerplate/config');
const {fixMenus} = require('./Templates');

/**
 * function to create the additional window
 * 
 * @param windowName window variable to send
 * @param height height of the window
 * @param width width of the window
 * @param title title of the window
 * @param componentPath path of the react component file mentioned in App.js
 * @param menuTemplate menu template in array format
 **/
const createWindow = (windowName, height, width, title, componentPath, menuTemplate) => {
    windowName = new BrowserWindow({
        width,
        height,
        title,
        webPreferences: {
            nodeIntegration: false,     // is default value after Electron v5
            contextIsolation: true,     // protect against prototype pollution
            enableRemoteModule: false,  // turn off remote
            preload: path.join(__dirname, "preload.js") // use a preload script
        },
    });
    if(menuTemplate){
        menuTemplate = fixMenus(menuTemplate);
        windowName.setMenu(Menu.buildFromTemplate(menuTemplate))
    }else{
        windowName.setMenu(null)
    }
    // load the component file
    windowName.loadURL(
        process.env.NODE_ENV !== 'production'
            ? path.join(config.DEV_SERVER_URL,componentPath)
            : config.getProdServerURL('#/' + componentPath)
    );

    windowName.on('close', () => {
        windowName = null;
    });
    return windowName;
}

module.exports = {
    createWindow
}