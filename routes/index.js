var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../model/user');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('login', {title: 'Express'});
});

router.post('/login', function (req, res, next) {
    var referer = req.body.referer;
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.flash('error_msg', info.message);
            return res.redirect('/login');
        }
        req.logIn(user, function (err) {//这里内部会调用passport.serializeUser()
            if (err) {
                return next(err);
            }
            req.flash('success_msg', '登录成功...');
            if (referer != 'http://127.0.0.1:3000/login') {
                return res.redirect(referer);
            }
            return res.redirect('/mylib/myborrow');
        });
    })(req, res, next);
});

passport.use(new LocalStrategy(
    function (username, password, done) {//username即数据库表中的readerId
        User.findUserByreaderId(username, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, {message: '找不到用户名'});
            }
            if (user.password != password) {
                return done(null, false, {message: '密码匹配有误!'});
            }
            return done(null, user);
        });
    })
);

// serializeUser 在用户登录验证成功以后将会把用户的数据存储到 session 中（在这里
// 存到 session 中的是用户的 username）。在这里的 user 应为我们之前在 new
// LocalStrategy (fution() { ... }) 中传递到回调函数 done 的参数 user 对象（从数据// 库中获取到的）
passport.serializeUser(function (user, done) {
    done(null, user.name);
});

// deserializeUser 在每次请求的时候将会根据用户名读取 从 session 中读取用户的全部数据
// 的对象，并将其封装到 req.user
passport.deserializeUser(function (username, done) {
    User.findUserByreaderId(username, function (err, user) {
        done(err, user);
    });
});

//登录验证
function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash('error_msg','You are not logged in');
        res.redirect('/login');
    }
}

module.exports = router;
