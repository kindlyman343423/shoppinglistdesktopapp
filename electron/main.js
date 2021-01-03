const electron = require('electron');
const url = require('url');
const path = require('path');
const { app, BrowserWindow, Menu, ipcMain } = electron;

const DEV_SERVER_URL = 'http://localhost:3000';

/**
 * set the NODE ENV value according to the mode
 * AVAILABLE VALUES
 * - production
 * - development
 **/
process.env.NODE_ENV = 'development';

let mainWindow;
let addWindow;

/**
 * MAIN WINDOW
 **/
app.on('ready', () => {
    // create new window
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
        },
    });

    // load the html file
    mainWindow.loadURL(
        process.env.NODE_ENV !== 'production'
            ? DEV_SERVER_URL
            : url.format({
                pathname: path.join(__dirname, '../build/index.html'),
                protocol: 'file:',
                slashes: true
            })
    );

    // quit app when closed
    mainWindow.on('close', () => {
        app.quit();
    });

    // build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    // insert the menu
    Menu.setApplicationMenu(mainMenu);
});

/**
 * ADD WINDOW
 **/
function createAddWindow() {
    // create new window
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Add Shopping List Item',
        webPreferences: {
            nodeIntegration: true,
        },
    });

    // load the add the component file
    addWindow.loadURL(
        process.env.NODE_ENV !== 'production'
            ? path.join(DEV_SERVER_URL,'add')
            : '/add'
    );

    addWindow.on('close', () => {
        addWindow = null;
    });
}

// catch item add
ipcMain.on('item:add', (e, item) => {
    console.log(item);
    // mainWindow.webContents.send('item:add', item);
    //addWindow.close();
});

// create a menu template
const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Add Item',
                click() {
                    createAddWindow();
                },
            },
            {
                label: 'Clear Items',
                click() {
                    mainWindow.webContents.send('item:clear');
                },
            },
            {
                label: 'Quit',
                accelerator:
                    process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit();
                },
            },
        ],
    },
];

// if mac add empty object to menu
if (process.platform === 'darwin') {
    mainMenuTemplate.unshift({});
}

// use dev tools only for dev env
if (process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle Dev Tools',
                accelerator:
                    process.platform === 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                },
            },
            {
                role: 'reload',
            },
        ],
    });
}
