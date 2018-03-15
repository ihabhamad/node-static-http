var basePath = __dirname;
var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');
var pathname;
var contentType = 'text/html';
var mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.ico': 'image/x-icon',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.svg': 'application/image/svg+xml',
    '.swf': 'application/x-shockwave-flash',
    '.flv': 'video/x-flv'
};
var server = http.createServer(serverandler);
function serverandler(request,response){
    pathname = url.parse(request.url, true).pathname;
    pathname = pathname.replace(/%20/g, " ");
  fs.exists(path.join(basePath, pathname),function(exists){
    if(exists){
       existhandler(request,response);
    }else{
      response.writeHead(404);
      response.end();
    }
  });
}
function existhandler(req,res){
  var extname = String(path.extname(path.join(basePath, pathname))).toLowerCase();

  var stream = fs.createReadStream(path.join(basePath, pathname));
  contentType = mimeTypes[extname] || 'application/octet-stream';
   stream.on('error', function() {
       res.writeHead(404);
       res.end();
   });

   fs.stat(path.join(basePath, pathname), function(error, stat) {
   if (error) { /*throw error;*/ res.writeHead(404); res.end(); }
     res.writeHead(200, {
       'Content-Type' : contentType,
       'Accept-Ranges': 'bytes',
       'Cache-Control': 'public, max-age=31536000',
       'connection'    : 'keep-alive',
       'Content-Length' : stat.size
      });
       stream.pipe(res);
   });
}
server.listen(3000);
