const http = require('http');
const https = require('https');
const util = require('../util');
const recorder = null;

function request(cReq, cRes) {
  /*
    note
      cReq.url is wired
      in http  server: http://www.example.com/a/b/c
      in https server: /a/b/c
  */

  const host = cReq.headers.host;
  const protocol =
    !!cReq.connection.encrypted && !/^http:/.test(cReq.url) ? 'https' : 'http';
  const fullUrl =
    protocol === 'http' ? cReq.url : protocol + '://' + host + cReq.url;

  const urlPattern = new URL(fullUrl);

  const path = `${urlPattern.pathname}${urlPattern.search}`;
  let resourceInfo = null;
  // let resourceInfoId = -1;
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
      port: urlPattern.port || cReq.port || (/https/.test(protocol) ? 443 : 80),
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
      const proxyReq = (/https/i.test(protocol) ? https : http).request(
        options,
        (res) => {
          res.headers = util.getHeaderFromRawHeaders(res.rawHeaders);
          // 处理响应头
          const statusCode = res.statusCode;
          const resHeader = res.headers;

          // 处理响应数据
          const resData = [];

          res.on('data', (chunk) => {
            resData.push(chunk);
          });

          res.on('end', () => {
            new Promise((resolve) => {
              resolve(Buffer.concat(resData));
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

  // fetch complete request data
  // co(fetchReqData)
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
        // resourceInfoId = recorder.appendRecord(resourceInfo);
      }

      // resourceInfo.reqBody = reqData.toString();
      // recorder && recorder.updateRecord(resourceInfoId, resourceInfo);
    })
    .then(async() => {
      const remoteResponse = await fetchRemoteResponse(requestDetail.protocol, requestDetail.requestOptions);
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
      console.log(error, 'error');
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
    .then(sendFinalResponse);
}

module.exports = request;
