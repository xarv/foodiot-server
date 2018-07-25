var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var DBClient = require('./data/DBClient');
DBClient.initialize();
var RedisClient = require('./data/RedisClient');
RedisClient.initialize(); 

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var traysRouter = require('./routes/trays');
var mappingsRouter = require('./routes/mappings');
var bowlRouter = require( './routes/bowls' );
var itemRouter = require( './routes/items' );
var qrReaderRouter = require('./routes/qrReader');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'build')));

app.use('/signup', (req, res) => {
	res.sendFile(path.join(__dirname,'build/index.html'))
});
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/trays', traysRouter);
app.use('/mapping', mappingsRouter);
app.use( '/bowls', bowlRouter );
app.use( '/items', itemRouter );
app.use('/qrReaders', qrReaderRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
