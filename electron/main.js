const electron = require('electron');
const url = require('url');
const path = require('path');
const { app, BrowserWindow, Menu, ipcMain } = electron;
const db = require('../mongoose/db');

const DEV_SERVER_URL = 'http://localhost:3000';
const dirname = __dirname.split('/');
dirname.pop();

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
                pathname: dirname.join('/') + '/build/index.html',
                protocol: 'file:',
                slashes: true
            })
    ).then(() => {
        db.getAllTheShoppingListItems()
        .then(res => {
            if(Array.isArray(res) && res.length>0){
                mainWindow.webContents.send('item:add', res);
            }
        })
    })

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
        width: 500,
        height: 500,
        title: 'Add Shopping List Item',
        webPreferences: {
            nodeIntegration: true,
        },
    });

    // load the add the component file
    addWindow.loadURL(
        process.env.NODE_ENV !== 'production'
            ? path.join(DEV_SERVER_URL,'add')
            : url.format({
                pathname: './add',
                protocol: 'file:',
                slashes: true
            })
    );

    addWindow.on('close', () => {
        addWindow = null;
    });
}

/*
 * catching calls from the react UI
 */
ipcMain.on('item:add', (e, item) => {
    // add the list item to mongo
    const res = db.addNewShoppingListItem(item);
    if(res.status!==null && res.status!==405){
        // sending values to Home
        mainWindow.webContents.send('item:add', item);
    }
    addWindow.close();
});
ipcMain.on('item:openAddWindow', ()=>{
    createAddWindow();
})
ipcMain.on('item:clearSelected',(e, name)=>{
    db.deleteSelectedItem(name)
    .catch(err => console.log(err))
})

// create a menu template
const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Add Item',
                accelerator:
                    process.platform === 'darwin' ? 'Command+L' : 'Ctrl+L',
                click() {
                    createAddWindow();
                },
            },
            {
                label: 'Clear Items',
                accelerator:
                    process.platform === 'darwin' ? 'Command+D' : 'Ctrl+D',
                click() {
                    db.deleteAllItems()
                    .then(()=>{
                        mainWindow.webContents.send('item:clear');
                    })
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
