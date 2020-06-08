const http = require('http');
const request = require('./request.js');
const connect = require('./connect.js');

function setup(callback) {
  // if (callback) cb = callback;
  const server = http.createServer();
  server
    .on('request', request)
    .on('connect', connect)
    .on('close', () => {
      console.log('============= close ===================');
    })
    .listen(8001, '0.0.0.0');
  return server;
}

setup();
