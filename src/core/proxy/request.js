const http = require('http');
const https = require('https');
const util = require('../util');
const zlib = require('zlib');
const DB = require('./operateDb.js');
const db = new DB();

function createRequest(recorder) {
  return function request(cReq, cRes) {
    /*
      note
        cReq.url is wired
        in http  server: http://www.example.com/a/b/c
        in https server: /a/b/c
    */

    const host = cReq.headers.host;
    const protocol =
      !!cReq.connection.encrypted && !/^http:/.test(cReq.url)
        ? 'https'
        : 'http';
    const fullUrl =
      protocol === 'http' ? cReq.url : protocol + '://' + host + cReq.url;

    const urlPattern = new URL(fullUrl);

    const path = `${urlPattern.pathname}${urlPattern.search}`;
    let resourceInfo = null;
    let resourceInfoId = -1;
    let reqData;
    let requestDetail;

    cReq.headers = util.getHeaderFromRawHeaders(cReq.rawHeaders);

    /**
     * 获取完整的req数据
     */
    const fetchReqData = () =>
      new Promise((resolve) => {
        const postData = [];
        cReq.on('data', (chunk) => {
          postData.push(chunk);
        });
        cReq.on('end', () => {
          reqData = Buffer.concat(postData);
          resolve();
        });
      });

    /**
     * 准备详细请求信息
     */
    const prepareRequestDetail = () => {
      const options = {
        hostname: urlPattern.hostname || cReq.headers.host,
        port:
          urlPattern.port || cReq.port || (/https/.test(protocol) ? 443 : 80),
        path,
        method: cReq.method,
        headers: cReq.headers
      };
      requestDetail = {
        requestOptions: options,
        protocol,
        url: fullUrl,
        requestData: reqData,
        _req: cReq
      };

      return Promise.resolve();
    };

    /**
     * 获取代理响应
     *
     * @param {string} protocol
     * @param {object} options 请求参数
     * @param {buffer} reqData 请求body
     * @param {object} config
     * @returns
     */
    function fetchRemoteResponse(protocol, options, reqData, config) {
      reqData = reqData || '';
      return new Promise((resolve, reject) => {
        // rule改动重置content-length
        delete options.headers['content-length'];
        delete options.headers['Content-Length'];
        options.headers['Content-Length'] = reqData.length;
        // 发送请求
        // console.log(options, 'option');
        const proxyReq = (/https/i.test(protocol) ? https : http).request(
          options,
          (res) => {
            res.headers = util.getHeaderFromRawHeaders(res.rawHeaders);
            // 处理响应头
            const statusCode = res.statusCode;
            const resHeader = res.headers;
            const contentEncoding =
              resHeader['content-encoding'] || resHeader['Content-Encoding'];
            const ifServerGzipped = /gzip/i.test(contentEncoding);
            if (ifServerGzipped) {
              delete resHeader['content-encoding'];
              delete resHeader['Content-Encoding'];
            }
            delete resHeader['content-length'];
            delete resHeader['Content-Length'];
            // 处理响应数据
            const resData = [];

            res.on('data', (chunk) => {
              resData.push(chunk);
            });

            res.on('end', () => {
              new Promise((resolve, reject) => {
                const serverResData = Buffer.concat(resData);
                if (ifServerGzipped) {
                  zlib.gunzip(serverResData, (err, buff) => {
                    if (err) {
                      reject(err);
                    } else {
                      resolve(buff);
                    }
                  });
                } else {
                  resolve(serverResData);
                }
              }).then((serverResData) => {
                resolve({
                  statusCode,
                  header: resHeader,
                  body: serverResData,
                  _res: res
                });
              });
            });
            res.on('error', (error) => {
              console.log('error happend in response:' + error);
              reject(error);
            });
          }
        );

        proxyReq.on('error', reject);
        proxyReq.end(reqData);
      }).catch((e) => {
        console.log(e, 'eee');
      });
    }

    /**
     * 将响应传递给客户端
     *
     * @param {object} finalResponseData
     * @param {number} finalResponseData.statusCode
     * @param {object} finalResponseData.header
     * @param {buffer|string} finalResponseData.body
     */
    const sendFinalResponse = (finalResponseData) => {
      const responseInfo = finalResponseData.response;
      if (!responseInfo) {
        throw new Error('failed to get response info');
      } else if (!responseInfo.statusCode) {
        throw new Error('failed to get response status code');
      } else if (!responseInfo.header) {
        throw new Error('filed to get response header');
      }
      cRes.writeHead(responseInfo.statusCode, responseInfo.header);
      const responseBody = responseInfo.body || '';

      cRes.end(responseBody);

      return responseInfo;
    };

    fetchReqData()
      .then(prepareRequestDetail)
      .then(() => {
        // record request info
        if (recorder) {
          resourceInfo = {
            host,
            method: cReq.method,
            path,
            protocol,
            url: protocol + '://' + host + path,
            req: cReq,
            startTime: new Date().getTime()
          };
          resourceInfo.reqBody = reqData.toString();
          resourceInfoId = recorder.addRecord(resourceInfo);
          console.log(resourceInfoId, 'request ====> resourceInfoId');
        }
      })
      .then(() => {
        // TODO:
        const hosts = db.getAll('hosts');
        const filterObj = hosts.find((o) => {
          return o.fromHost === requestDetail.requestOptions.hostname;
        });
        if (filterObj) {
          requestDetail.requestOptions.hostname = filterObj.toHost;
        }
      })
      .then(async function() {
        const remoteResponse = await fetchRemoteResponse(
          requestDetail.protocol,
          requestDetail.requestOptions,
          requestDetail.requestData
        );
        return {
          response: {
            statusCode: remoteResponse.statusCode,
            header: remoteResponse.header,
            body: remoteResponse.body
          },
          _res: remoteResponse._res
        };
      })
      .catch((error) => {
        const errorResponse = {
          statusCode: 500,
          header: {
            'Content-Type': 'text/html; charset=utf-8',
            'Proxy-Error': true,
            'Proxy-Error-Message': error || 'null'
          },
          body: error
        };

        return {
          response: errorResponse
        };
      })
      .then(sendFinalResponse)
      .then((responseInfo) => {
        resourceInfo.endTime = new Date().getTime();
        resourceInfo.res = {
          statusCode: responseInfo.statusCode,
          headers: responseInfo.header
        };
        resourceInfo.statusCode = responseInfo.statusCode;
        resourceInfo.resHeader = responseInfo.header;
        resourceInfo.resBody = responseInfo.body
          ? responseInfo.body.toString()
          : '';
        resourceInfo.length = resourceInfo.resBody.length;

        if (recorder) {
          recorder.updateRecord(resourceInfoId, resourceInfo);
          recorder.send(resourceInfoId);
        }
      })
      .catch((e) => {
        console.log('没有resourceInfo');
      });
  };
}

module.exports = createRequest;
