function killProcessAtPort(port) {
    const spawn = require('child_process').spawn;
    const out = spawn(`kill $(lsof -t -i:${port})`, { shell: true });
    out.stdout.on('data', (data) => {
        console.log('log: ' + data.toString());
    });
    out.stderr.on('data', (data) => {
        console.log('error:' + data.toString());
    });
}

module.exports = {
    killProcessAtPort,
};
