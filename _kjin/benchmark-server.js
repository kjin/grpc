const { startServer } = require('.')

global.experimental = false
startServer('insecure')
