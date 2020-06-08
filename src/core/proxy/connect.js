const net = require('net');

function connect(req, socket) {
  socket.on('error', (err) => {
    if (err) {
      console.log(err, 'csock error');
    }
  });
  const host = req.url.split(':')[0];
  const targetPort = req.url.split(':')[1];
  let resourceInfo;
  // let resourceInfoId;

  function _sendFailedSocket(error) {
    let errorHeader = 'Proxy-Error: true\r\n';
    errorHeader += 'Proxy-Error-Message: ' + (error || 'null') + '\r\n';
    errorHeader += 'Content-Type: text/html\r\n';
    socket.write(
      'HTTP/' +
        req.httpVersion +
        ' 502 Proxy Inner Error\r\n' +
        errorHeader +
        '\r\n\r\n'
    );
  }

  new Promise((resolve) => {
    resourceInfo = {
      host,
      method: req.method,
      path: '',
      url: 'https://' + host,
      req,
      startTime: new Date().getTime()
    };
    // console.log(resourceInfo);
    // resourceInfoId = recorder.appendRecord(resourceInfo);
    resolve();
  })
    .then(() => {
      return {
        host,
        port: targetPort === 80 ? 443 : targetPort
      };
    })
    .then((serverInfo) => {
      if (!serverInfo.port || !serverInfo.host) {
        throw new Error('failed to get https server info');
      }
      return new Promise((resolve, reject) => {
        const conn = net.connect(serverInfo.port, serverInfo.host, () => {
          socket.write(
            'HTTP/' + req.httpVersion + ' 200 OK\r\n\r\n',
            'UTF-8',
            () => {
              conn.pipe(socket);
              socket.pipe(conn);

              resolve();
            }
          );
        });
        conn.on('error', (e) => {
          reject(e);
        });
      });
    })
    .catch((error) => {
      try {
        _sendFailedSocket(error);
      } catch (e) {
        console.e('error', error);
      }
    });
}

module.exports = connect;
