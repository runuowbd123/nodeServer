const http = require('http');
const nUrl = require('url');
const config = require('./config');
const Route = require('./route');
const util = require('./util');
const server = http.createServer((req, res) => {
  let method = req.method;
  let url = nUrl.parse(req.url);
  let matchRoute = Route.find((item) => {
    return item.method === method && item.path === url.pathname;
  })
  if (matchRoute) {
    res.statusCode = 200;
    res.setHeader('Content-Type', matchRoute.headers);
    let arr = []
    req.on('data', (c) => {
      arr.push(c);
    })
    req.on('end', () => {
      if (req.method === 'POST') {
        const body = (Buffer.concat(arr)).toString('utf8');
        const rbody = util.getBody(body); // 用postman的时候需要这样解析
        res.end(body)
        res.end(matchRoute.result);
      } else {
        res.end(matchRoute.result);
      }
    })
    return;
  }
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Not Found');
});
server.listen(config.port, config.hostname, () => {
  console.log(`Server running at <a href="http://${config.hostname}:${config.port}/api/text`);
});