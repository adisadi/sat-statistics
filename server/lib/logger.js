const winston = require('winston');

winston.configure({
    transports: [
        new (winston.transports.Console)({ level: 'error' }),
        new (winston.transports.File)({ name: 'error-file', filename: 'error.log', level: 'error' }),
        /*new (winston.transports.File)({ name: 'info-file', filename: 'info.log', level: 'info' })*/
    ]
});

winston.cli();

module.exports = { winston };