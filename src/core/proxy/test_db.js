const DB = require('./operateDb');

const db = new DB();

db.add('hosts', { fromHost: 'wwww.abc.com', toHost: '127.0.0.1' });

console.log(db.getAll('hosts'));
