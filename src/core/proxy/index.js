const setup = require('./setup.js');
const Recorder = require('./recorder.js');

const path = require('path');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
let proxy = null;

app.use('/', express.static(path.join(__dirname, 'dist')));

// socket连接
io.on('connection', (socket) => {
  console.log('connection');

  const recorder = new Recorder((res) => {
    console.log(Object.keys(res), res.statusCode, '================');
    io.emit('update', res);
  });

  if (!proxy) {
    proxy = setup(recorder);
  };
});

// 监听端口
server.listen(3000, () => {
  console.log('listening on *:3000');
});
