class Recorder {
  constructor(callback) {
    this.infoMap = [];
    this.id = 0;
    this.callback = callback;
  }

  addRecord(info) {
    this.infoMap[++this.id] = info;
    return this.id;
  }

  updateRecord(id, info) {
    this.infoMap[id] = info;
  }

  send(id) {
    // console.log(this.infoMap[id], 'this.infoMap[id]');
    if (!this.infoMap[id]) {
      console.log(id, 'error id');
    }
    this.callback(this.infoMap[id]);
  }
}

module.exports = Recorder;
