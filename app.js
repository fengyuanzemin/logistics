var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var handlebars = require('express-handlebars');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var flash = require('connect-flash');

var session = require('express-session');
var passport = require('passport');
// var LocalStrategy = require('passport-local').Strategy;

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars({
    defaultLayout: 'layout',
    partialsDir: [//设置partialsdir
        'views/partials/'
    ]
}));
app.set('view engine', 'handlebars');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



//配置session,passpord必要的中间件
app.use(session({
    secret: 'secret',//加密字符串
    resave: true,
    saveUninitialized: true
}));

// Passport init 身份验证模块passport初始化
app.use(passport.initialize());
app.use(passport.session());

//网站信息寄存器
app.use(flash());

app.use(function(req,res,next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.user = req.user || null;
    next();
});

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
