module.exports = {
    DEV_SERVER_URL: 'http://localhost:3000',
    getProdServerURL: (path) => {
        const dirname = __dirname.split('/');
        dirname.pop();
        dirname.push('build');
        dirname.push('index.html');
        dirname.unshift('file:/');
        return dirname.join('/') + (path ? path : '');
    },
    setNodeEnv: (nodeEnv) => {
        if (
            nodeEnv &&
            (nodeEnv === 'production' || nodeEnv === 'development')
        ) {
            console.log(`Overwriting NODE_ENV from ${process.env.NODE_ENV} -> ${nodeEnv}`);
            process.env.NODE_ENV = nodeEnv;
            return true;
        }
        return false;
    },
    init: ()=>{
        console.log('\x1b[1;30;43m',`Application Running in ${process.env.NODE_ENV}`,'\x1b[0m');
    }
};
