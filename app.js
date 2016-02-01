var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require('hbs');
hbs.registerPartials(__dirname + '/views/partials');
hbs.registerHelper('math', function(lvalue, operator, rvalue, options) {
  lvalue = parseFloat(lvalue), rvalue = parseFloat(rvalue);
  return {
    "+": lvalue + rvalue,
    "-": lvalue - rvalue,
    "*": lvalue * rvalue,
    "/": lvalue / rvalue,
    "%": lvalue % rvalue
  } [operator];
});
var routes = require('./routes/index');
var admin = require('./routes/admin');
var news = require('./routes/news');
var exhibit = require('./routes/exhibit');
var app = express();
var session = require('express-session');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret:'secret',
  resave:true,
  saveUninitialized:false,
  cookie:{
    maxAge:1000*60*10 //过期时间设置(单位毫秒)
  }
}));
app.use('/', routes);
//app.use('/users', users);
app.use('/admin', admin);
app.use(function(req, res, next){
  if (req.session !== undefined && req.session['user']){
    next();
  }
  else{
    res.redirect('/admin/login');
  }
});

app.use('/news', news);
app.use('/exhibit', exhibit);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

hbs.registerHelper('ifcond', function(v1, v2, options) {
  if (v1 == v2) return options.fn(this);
  return options.inverse(this);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
