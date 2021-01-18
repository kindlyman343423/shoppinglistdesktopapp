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

/**
 * MAIN WINDOW
 **/
app.on('ready', () => {
    // create new window
    global.mainWindow = new BrowserWindow({
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
    global.mainWindow
        .loadURL(
            process.env.NODE_ENV !== 'production'
                ? config.DEV_SERVER_URL
                : config.getProdServerURL('#/')
        )
        .then(() => {
            db.getAllTheShoppingListItems()
                .then((res) => {
                    if (Array.isArray(res) && res.length > 0) {
                        global.mainWindow.webContents.send('item:add', res);
                    }
                })
                .catch((err) => {
                    global.mainWindow.webContents.send(
                        'item:error',
                        err === 502
                            ? 'We are unable to get the shopping list Items. Please check your mongodb connection'
                            : 'Unable to get shopping list Items'
                    );
                });
        });

    // quit app when closed
    global.mainWindow.on('close', () => {
        app.quit();
        killport(3000);
    });

    // build menu from template
    const mainMenuTemplate = getMainMenuTemplate(app);
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
            global.mainWindow.webContents.send('item:add', item);
            global.addWindow.close();
        })
        .catch((err) => {
            global.addWindow.webContents.send(
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
    global.addWindow = wcHandler.createWindow(global.addWindow, 500, 500, 'Add Shopping List Item', 'add', [
        {
            label: 'File',
            submenu: [
                {
                    label: 'Quit',
                    accelerator:
                        process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                    click() {
                        global.addWindow.close();
                    },
                },
            ],
        },
    ]);
});
ipcMain.handle('item:clearSelected', async (e, name) => {
    db.deleteSelectedItem(name).catch((err) => {
        global.mainWindow.webContents.send(
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
                global.mainWindow.webContents.send('item:add', res);
            }
        })
        .catch((err) => {
            global.mainWindow.webContents.send(
                'item:error',
                err === 502
                    ? 'We are unable to get the shopping list Items. Please check your mongodb connection'
                    : 'Unable to get shopping list Items'
            );
        });
}, 120000);
