const express = require('express');
const app = express();
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));
var cors = require('cors');
app.use(cors());

app.get('/test', (req, res) => {
  console.log(req.body);
  res.end('hello world');
});

app.post('/test', (req, res) => {
  console.log(req.body);
  // console.log(req);

  res.json({ a: 1 });
});

app.listen(7788);
