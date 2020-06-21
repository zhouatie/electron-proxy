const net = require('net');
const DB = require('./operateDb.js');

const db = new DB();

function createConnect(recorder) {
  return function connect(req, socket) {
    socket.on('error', (err) => {
      if (err) {
        console.log(err, 'cSock error');
      }
    });
    const host = req.url.split(':')[0];
    const targetPort = req.url.split(':')[1];
    let resourceInfo;
    let resourceInfoId;

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
      if (recorder) {
        resourceInfoId = recorder.addRecord(resourceInfo);
        console.log(resourceInfoId, 'connect ====> resourceInfoId');
        recorder.send(resourceInfoId);
      }
      resolve();
    })
      .then(() => {
        return {
          host,
          port: targetPort === 80 ? 443 : targetPort
        };
      })
      .then((serverInfo) => {
        console.log(serverInfo.host, 'requestDetail***********');
        const hosts = db.getAll('hosts');
        console.log(hosts, 'connect hosts');
        const filterObj = hosts.find((o) => o.fromHost === serverInfo.host);
        if (filterObj) {
          serverInfo.host = filterObj.toHost;
        }

        return serverInfo;
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
  };
}

module.exports = createConnect;
