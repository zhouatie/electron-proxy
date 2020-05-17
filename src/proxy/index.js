const http = require('http');
const net = require('net');
// const url = require('url');

function request(cReq, cRes) {
  console.log('request');
  const u = new URL(cReq.url);

  const options = {
    hostname: u.hostname,
    port: u.port || 80,
    path: u.path,
    method: cReq.method,
    headers: cReq.headers
  };

  const pReq = http
    .request(options, function(pRes) {
      cRes.writeHead(pRes.statusCode, pRes.headers);
      pRes.pipe(cRes);
    })
    .on('error', function(e) {
      cRes.end();
    });

  cReq.pipe(pReq);
}

function connect(cReq, cSock) {
  cSock.on('error', (err) => {
    if (err) {
      console.log('csock error');
    }
  });

  const u = new URL('http://' + cReq.url);
  console.log('connect');

  const pSock = net
    .connect(u.port, u.hostname, function() {
      cSock.write('HTTP/1.1 200 Connection Established\r\n\r\n');
      pSock.pipe(cSock);
    })
    .on('error', function(e) {
      cSock.end();
    });

  cSock.pipe(pSock);
}

// http
//   .createServer()
//   .on('request', request)
//   .on('connect', connect)
//   .listen(8001, '0.0.0.0');

export default function setup(server) {
  if (!server) server = http.createServer();
  server
    .on('request', request)
    .on('connect', connect)
    .listen(8001, '0.0.0.0');
};
