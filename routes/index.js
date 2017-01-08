var express = require('express');
var router = express.Router();
var passport = require('passport');
var bcrypt = require('bcrypt');
var saltRounds = require('../config/salt');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../model/User');
var Logistics = require('../model/Logistics');

router.get('/', function (req, res, next) {
    if (res.locals.user) {
        res.redirect('/admin');
        return;
    }
    res.render('index', {title: '首页'});
});

router.get('/list', function (req, res, next) {
    Logistics.findAll(function (err, rows) {
        if (err) {
            req.flash('error_msg', '拉取物流信息失败');
            res.redirect('/');
            return;
        }
        res.render('list', {
            title: '物流列表',
            list: rows
        });
    });
});

router.get('/detail/:id', function (req, res, next) {
    Logistics.findDetailById(req.params.id, function (err, rows) {
        if (err) {
            req.flash('error_msg', '拉取物流详情失败');
            res.redirect('/list');
            return;
        }
        res.render('detail', {
            title: '物流详情',
            detail: rows
        })
    });
});

router.get('/search', function (req, res, next) {
    res.render('search', {title: '搜索'});
});

router.post('/search', function (req, res, next) {
    Logistics.findById(req.body.id, function (err, rows) {
        if (err) {
            req.flash('error_msg', '拉取物流信息失败');
            res.redirect('/');
            return;
        }
        res.render('list', {
            title: '搜索结果',
            list: rows
        });
    });
});

router.get('/login', function (req, res, next) {
    res.render('login', {title: '登录'});
});

router.get('/register', function (req, res, next) {
    res.render('register', {title: '注册'});
});

//退出登录
router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/login');
});

router.post('/login', function (req, res, next) {
    passport.authenticate('local-login', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.flash('error_msg', info.message);
            return res.redirect('/login');
        }
        req.login(user, function (err) {//这里内部会调用passport.serializeUser()
            if (err) {
                return next(err);
            }
            req.flash('success_msg', info.message);
            return res.redirect('/admin');
        });
    })(req, res, next);
});

passport.use('local-login', new LocalStrategy({
        usernameField: 'phone',
        passwordField: 'password'
    },
    function (phone, password, done) {
        User.findUserByPhone(phone, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, {message: '找不到用户名2333'});
            }
            bcrypt.compare(password, user.password).then(function (res) {
                if (res) {
                    return done(null, user, {message: '登录成功'});
                } else {
                    return done(null, false, {message: '用户不存在或者密码不正确'});
                }
            });
        });
    })
);

router.post('/register', function (req, res, next) {
    passport.authenticate('local-register', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.flash('error_msg', info.message);
            return res.redirect('/register');
        }
        req.login(user, function (err) {// 这里内部会调用passport.serializeUser()
            if (err) {
                return next(err);
            }
            req.flash('success_msg', info.message);
            return res.redirect('/admin');
        });
    })(req, res, next);
});


passport.use('local-register', new LocalStrategy({
        usernameField: 'phone',
        passwordField: 'password'
    },
    function (phone, password, done) {
        bcrypt.hash(password, saltRounds).then(function (hash) {
            User.register(phone, hash, function (err, user) {
                if (err) {
                    return done(err);
                }
                return done(null, user, {message: '注册成功'});
            });
        });
    })
)
;

// serializeUser 在用户登录验证成功以后将会把用户的数据存储到 session 中（在这里
// 存到 session 中的是用户的 username）。在这里的 user 应为我们之前在 new
// LocalStrategy (fution() { ... }) 中传递到回调函数 done 的参数 user 对象（从数据// 库中获取到的）
passport.serializeUser(function (user, done) {
    done(null, user.phone);
});

// deserializeUser 在每次请求的时候将会根据用户名读取 从 session 中读取用户的全部数据
// 的对象，并将其封装到 req.user
passport.deserializeUser(function (phone, done) {
    User.findUserByPhone(phone, function (err, user) {
        done(err, user);
    });
});

//登录验证
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('error_msg', 'You are not logged in');
        res.redirect('/login');
    }
}

module.exports = router;
