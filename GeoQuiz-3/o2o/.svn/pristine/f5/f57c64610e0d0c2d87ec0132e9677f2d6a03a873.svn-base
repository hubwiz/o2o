var path    = require('path'),
    logger  = require('morgan'),
    express = require('express'),
    favicon = require('serve-favicon'),
    bodyParser   = require('body-parser'),
    cookieParser = require('cookie-parser');
var app= express(),
    server  = require('http').Server(app);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine( '.html', require( 'ejs' ).__express );

//app.use(favicon(path.join(__dirname,'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
require('./routes')(app);
require('./lib/socket')(server);
server.listen(3000,function(){
    console.log('App start,port 3000.');
});

