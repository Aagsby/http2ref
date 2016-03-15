var fs = require('fs');
var http = require('http');
var http2 = require('http2');
var Router = require('router');
var finalhandler = require('finalhandler');

var router = new Router();

router.get('/', function (req, res) {
    res.setHeader('Content-type', 'text/html');
    var readStream = fs.createReadStream('./index.html');
    readStream.pipe(res);
});

router.get('/large', function (req, res) {
    res.setHeader('Content-type', 'text/html');
    var readStream = fs.createReadStream('./indexLarge.html');
    readStream.pipe(res);
});

router.get('/public/smallCss/*.css', function (req, res) {
    res.setHeader('Content-type', 'text/html');
    var readStream = fs.createReadStream('.' + req._parsedUrl.path);
    readStream.pipe(res);
    //return res.end('<h1>Hello, Secure World!</h1>');
});

router.get('/public/*.css', function (req, res) {
    res.setHeader('Content-type', 'text/html');
    var readStream = fs.createReadStream('.' + req._parsedUrl.path);
    readStream.pipe(res);
    //return res.end('<h1>Hello, Secure World!</h1>');
});

var options = {
  key: fs.readFileSync('./localhost.key'),
  cert: fs.readFileSync('./localhost.crt')
};

function app(req, res) {
    router(req, res, finalhandler(req, res));
}

function useHttp2() {
  http2.createServer(options, app).listen(8443);
}

function useHttp() {
  var server = http.createServer(function(req, res) {
    router(req, res, finalhandler(req, res))
  })
  server.listen(8888)
}

useHttp();
useHttp2();