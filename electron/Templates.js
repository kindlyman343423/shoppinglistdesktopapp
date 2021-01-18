const db = require('../controller/db');

const developerToolsMenu = {
    label: 'Developer Tools',
    submenu: [
        {
            label: 'Toggle Dev Tools',
            accelerator: process.platform === 'darwin' ? 'Command+I' : 'Ctrl+I',
            click(item, focusedWindow) {
                focusedWindow.toggleDevTools();
            },
        },
        {
            role: 'reload',
        },
    ],
};

/**
 * fix menu template for mac and for non prod environment
 * @param template to fix
 **/
const fixMenus = (template) => {
    // if mac add empty object to menu
    if (process.platform === 'darwin') {
        template.unshift({});
    }

    // use dev tools only for dev and test env
    if (process.env.NODE_ENV !== 'production') {
        template.push(developerToolsMenu);
    }
    return template;
};

/**
 * return the main template for the app
 * @param app
 **/
const getMainMenuTemplate = (app) => {
    // create a menu template
    let mainMenuTemplate = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'Add Item',
                    accelerator:
                        process.platform === 'darwin' ? 'Command+L' : 'Ctrl+L',
                    click() {
                        global.addWindow = require('./winCreationHandler').createWindow(global.addWindow, 500, 500, 'Add Shopping List Item', 'add',[
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
                    },
                },
                {
                    label: 'Clear Items',
                    accelerator:
                        process.platform === 'darwin' ? 'Command+D' : 'Ctrl+D',
                    click() {
                        db.deleteAllItems()
                            .then(() => {
                                global.mainWindow.webContents.send('item:clear');
                            })
                            .catch((err) => {
                                global.mainWindow.webContents.send(
                                    'item:error',
                                    err === 502
                                        ? 'Unable to clear the Items. Please check your mongodb connection.'
                                        : 'Unable to clear the Items'
                                );
                            });
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
    mainMenuTemplate = fixMenus(mainMenuTemplate);
    return mainMenuTemplate;
};

module.exports = {
    developerToolsMenu,
    fixMenus,
    getMainMenuTemplate,
};
