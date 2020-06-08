module.exports.getHeaderFromRawHeaders = function(rawHeaders) {
  const headerObj = {};
  if (rawHeaders) {
    for (let i = 0; i < rawHeaders.length; i += 2) {
      const key = rawHeaders[i];
      const value = rawHeaders[i + 1];
      headerObj[key] = value;
    }
  }

  return headerObj;
};
