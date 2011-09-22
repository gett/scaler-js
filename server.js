var server = require('router').create();
var bark = require('bark');

server.get('/', bark.file('./example.html'));
server.get('/s/*', bark.file('./{*}'));

server.listen(10000);
console.log('server running 10000');