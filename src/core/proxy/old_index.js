const http = require('http');
const net = require('net');

let cb = null;

function request(cReq, cRes) {
  const parsed = new URL(cReq.url);

  parsed.method = cReq.method;

  const headers = {};

  parsed.headers = headers;

  const pReq = http
    .request(parsed, function(pRes) {
      cRes.writeHead(pRes.statusCode, pRes.headers);
      pRes.pipe(cRes);
      cb && cb(cReq, pRes);
    })
    .on('error', function(e) {
      cRes.end();
    });

  cReq.pipe(pReq);
}

function connect(cReq, cSock) {
  cSock.on('error', (err) => {
    if (err) {
      console.log(err, 'csock error');
    }
  });

  const u = new URL('http://' + cReq.url);
  console.log('connect');

  const pSock = net
    .connect(u.port, u.hostname, function() {
      cSock.write('HTTP/1.1 200 Connection Established\r\n\r\n');
      pSock.pipe(cSock);
      cb && cb(cReq, pSock);
    })
    .on('error', function(e) {
      cSock.end();
    });

  cSock.pipe(pSock);
}

function setup(callback) {
  if (callback) cb = callback;
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
