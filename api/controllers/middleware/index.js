var middleware = {};

// adds cross domain functionality, in a very loose way
middleware.allowAllCors = require('./lib/allowAllCors');

module.exports = middleware;