const electron = require('electron');
const path = require('path');
const { app, BrowserWindow, Menu, ipcMain } = electron;
const db = require('../controller/db');
const killport = require('./util/kill').killProcessAtPort;
const config = require('../.erboilerplate/config');
const wcHandler = require('./winCreationHandler');
const { getMainMenuTemplate } = require('./Templates');

// for using package-linux,package-win and package-mac scripts please uncomment below line
// config.setNodeEnv('production');
config.init();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let addWindow;

/**
 * MAIN WINDOW
 **/
app.on('ready', () => {
    // create new window
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: false, // is default value after Electron v5
            contextIsolation: true, // protect against prototype pollution
            enableRemoteModule: false, // turn off remote
            preload: path.join(__dirname, 'preload.js'), // use a preload script
        },
        icon: config.getIconsPath(),
        title: 'Shopping List App',
    });

    // load the app mainWindow
    mainWindow
        .loadURL(
            process.env.NODE_ENV !== 'production'
                ? config.DEV_SERVER_URL
                : config.getProdServerURL('#/')
        )
        .then(() => {
            db.getAllTheShoppingListItems()
                .then((res) => {
                    if (Array.isArray(res) && res.length > 0) {
                        mainWindow.webContents.send('item:add', res);
                    }
                })
                .catch((err) => {
                    mainWindow.webContents.send(
                        'item:error',
                        err === 502
                            ? 'We are unable to get the shopping list Items. Please check your mongodb connection'
                            : 'Unable to get shopping list Items'
                    );
                });
        });

    // quit app when closed
    mainWindow.on('close', () => {
        app.quit();
        killport(3000);
    });

    // build menu from template
    const mainMenuTemplate = getMainMenuTemplate(app, mainWindow, addWindow);
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    // insert the menu
    Menu.setApplicationMenu(mainMenu);
});

/*
 * catching calls from the react UI
 */
ipcMain.handle('item:add', async (e, item) => {
    // add the list item to mongo
    db.addNewShoppingListItem(item)
        .then((res) => {
            // sending values to Home
            mainWindow.webContents.send('item:add', item);
            addWindow.close();
        })
        .catch((err) => {
            addWindow.webContents.send(
                'item:error',
                err === 502
                    ? 'Unable to add the Item. Please check your mongo connection'
                    : err === 405
                        ? 'Adding Null or Empty item is not allowed'
                        : 'Unable to add the Item to the list'
            );
        });
});
ipcMain.handle('item:openAddWindow', async () => {
    addWindow = wcHandler.createWindow(addWindow, 500, 500, 'Add Shopping List Item', 'add', [
        {
            label: 'File',
            submenu: [
                {
                    label: 'Quit',
                    accelerator:
                        process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                    click() {
                        addWindow.close();
                    },
                },
            ],
        },
    ]);
});
ipcMain.handle('item:clearSelected', async (e, name) => {
    db.deleteSelectedItem(name).catch((err) => {
        mainWindow.webContents.send(
            'item:error',
            err === 502
                ? 'Unable to delete the Selected Item. Please check your mongodb connection.'
                : 'Unable to delete the Selected Item'
        );
    });
});

// database connection to be checked after 2 mins
setInterval(() => {
    console.log('Connected: ', process.env.CONNECTION === 'true');
    db.connectToDB();
    db.getAllTheShoppingListItems()
        .then((res) => {
            if (Array.isArray(res) && res.length > 0) {
                mainWindow.webContents.send('item:add', res);
            }
        })
        .catch((err) => {
            mainWindow.webContents.send(
                'item:error',
                err === 502
                    ? 'We are unable to get the shopping list Items. Please check your mongodb connection'
                    : 'Unable to get shopping list Items'
            );
        });
}, 120000);
