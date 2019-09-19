var express = require('express'),
  http = require('http'),
  path = require('path'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  cors = require('cors');

var app = express();

var port = process.env.PORT || 8081;
app.set('port', port);
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cors());
app.use(bodyParser.json());
app.use(methodOverride());
app.use('/media', express.static('store/media'));

app.use('/', require('./src/index.js'));

http.createServer(app).listen(port);
console.log('port ' + port);
