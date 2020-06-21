const http = require('http');
const createRequest = require('./request.js');
const createConnect = require('./connect.js');

/**
 * 安装代理
 *
 * @param {Recorder} recorder 记录实例
 * @returns server
 */
function setup(recorder) {
  const server = http.createServer();
  server
    .on('request', createRequest(recorder))
    .on('connect', createConnect(recorder))
    .on('close', () => {
      console.log('======>>> weProxy had close <<<==========');
    })
    .listen(8001, '0.0.0.0');
  return server;
}

module.exports = setup;
// setup();
