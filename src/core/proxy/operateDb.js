const { app, remote } = require('electron');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');
const fs = require('fs');

// 根据process.type来分辨在哪种模式使用哪种模块
const APP = process.type === 'renderer' ? remote.app : app;

// 获取electron应用的用户目录
const STORE_PATH = APP.getPath('userData');
if (process.type !== 'renderer') {
  // 如果不存在路径
  if (!fs.existsSync(STORE_PATH)) {
    // 就创建
    fs.mkdirSync(STORE_PATH);
  }
}
const adapter = new FileSync(path.join(STORE_PATH, '/db.json'));
const db = low(adapter);
db.defaults({
  hosts: [
    {
      fromHost: 'www.abc.com',
      toHost: '127.0.0.1'
    }
  ]
}).write();
class DB {
  add(type, params) {
    const hasObj = db
      .get(type)
      .find(params)
      .value();
    if (hasObj) {
      return {
        code: 0
      };
    } else {
      db.get(type)
        .push(params)
        .write();
    }
    return {
      code: 0
    };
  }

  edit(type, filter, params) {
    db.get(type)
      .find(filter)
      .assign(params)
      .write();
    return {
      code: 0
    };
  }

  getAll(type) {
    const a = db
      .get(type)
      .cloneDeep()
      .value();
    console.log(a, db.get(type), 'aa');
    return a;
    // return db
    //   .get(type)
    //   .cloneDeep()
    //   .value();
  }
}

module.exports = DB;
