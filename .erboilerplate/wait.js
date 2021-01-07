const { shell } = require('electron');
const net = require('net');
const port = process.env.PORT || 3000;

const client = new net.Socket();

let startedElectron = false;
const tryConnection = () => client.connect({port: port}, () => {
        client.end();
        if(!startedElectron) {
            console.log('starting electron');
            startedElectron = true;
            const spawn = require('child_process').spawn;
            const out = spawn('yarn run electron',{shell: true})
            out.stdout.on('data', (data)=>{
                console.log(data.toString());
            })
            out.stderr.on('data', (data)=>{
                console.log(data.toString());
            })
        }
    }
);

tryConnection();

client.on('error', (error) => {
    setTimeout(tryConnection, 1000);
});