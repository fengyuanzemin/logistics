import express from 'express';
import passport from 'passport';
import bcrypt from 'bcrypt';
import passportLocal from 'passport-local';
import ccap from 'ccap';
import saltRounds from '../config/salt';
import User from '../model/User';
import Logistics from '../model/Logistics';

const router = express.Router();
let captchaString = '';
const LocalStrategy = passportLocal.Strategy;

router.get('/', (req, res) => {
    if (res.locals.user) {
        res.redirect('/admin');
        return;
    }
    res.render('index', { title: '首页' });
});

router.get('/list', (req, res) => {
    Logistics.findAll((err, rows) => {
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

router.get('/detail/:id', (req, res) => {
    Logistics.findDetailById(req.params.id, (err, rows) => {
        if (err) {
            req.flash('error_msg', '拉取物流详情失败');
            res.redirect('/list');
            return;
        }
        res.render('detail', {
            title: '物流详情',
            detail: rows
        });
    });
});

router.get('/search', (req, res) => {
    res.render('search', { title: '搜索' });
});

router.post('/search', (req, res) => {
    Logistics.findById(req.body.id, (err, rows) => {
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

router.get('/login', (req, res) => {
    res.render('login', { title: '登录' });
});

router.get('/register', (req, res) => {
    res.render('register', { title: '注册' });
});

router.get('/captcha', (req, res) => {
    const captcha = ccap().get();
    captchaString = captcha[0];
    res.end(captcha[1]);
});

// 退出登录
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

router.post('/login', (req, res, next) => {
    if (req.body.captcha.toLowerCase() === captchaString.toLowerCase()) {
        passport.authenticate('local-login', (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                req.flash('error_msg', info.message);
                return res.redirect('/login');
            }
            req.login(user, (error) => { // 这里内部会调用passport.serializeUser()
                if (err) {
                    return next(error);
                }
                req.flash('success_msg', info.message);
                return res.redirect('/admin');
            });
        })(req, res, next);
    } else {
        req.flash('error_msg', '验证码不正确');
        return res.redirect('/login');
    }
});

passport.use('local-login', new LocalStrategy({ usernameField: 'phone', passwordField: 'password' },
    (phone, password, done) => {
        User.findUserByPhone(phone, (err, user) => {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, { message: '找不到用户名2333' });
            }
            bcrypt.compare(password, user.password).then((res) => {
                if (res) {
                    return done(null, user, { message: '登录成功' });
                }
                return done(null, false, { message: '用户不存在或者密码不正确' });
            });
        });
    })
);

router.post('/register', (req, res, next) => {
    if (req.body.captcha.toLowerCase() === captchaString.toLowerCase()) {
        passport.authenticate('local-register', (err, user, info) => {
            if (err) {
                req.flash('error_msg', err);
                return res.redirect('/register');
            }
            if (!user) {
                req.flash('error_msg', info.message);
                return res.redirect('/register');
            }
            req.login(user, (error) => { // 这里内部会调用passport.serializeUser()
                if (err) {
                    req.flash('error_msg', error);
                    return res.redirect('/register');
                }
                req.flash('success_msg', info.message);
                return res.redirect('/admin');
            });
        })(req, res, next);
    } else {
        req.flash('error_msg', '验证码不正确');
        return res.redirect('/register');
    }
});


passport.use('local-register', new LocalStrategy({ usernameField: 'phone', passwordField: 'password' },
    (phone, password, done) => {
        if (!/^1(3|5|7|8)\d{9}$/.test(phone)) {
            return done('手机号格式不正确');
        }
        if (password.length < 6 || password.length > 14) {
            return done('密码长度应该在6位到14位之间');
        }
        if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) {
            return done('密码应该包含大小写字母和数字');
        }
        bcrypt.hash(password, saltRounds).then((hash) => {
            User.register(phone, hash, (err, user) => {
                if (err) {
                    return done(err);
                }
                return done(null, user, { message: '注册成功' });
            });
        });
    })
)
;

// serializeUser 在用户登录验证成功以后将会把用户的数据存储到 session 中（在这里
// 存到 session 中的是用户的 username）。在这里的 user 应为我们之前在 new
// LocalStrategy (fution() { ... }) 中传递到回调函数 done 的参数 user 对象（从数据// 库中获取到的）
passport.serializeUser((user, done) => {
    done(null, user.phone);
});

// deserializeUser 在每次请求的时候将会根据用户名读取 从 session 中读取用户的全部数据
// 的对象，并将其封装到 req.user
passport.deserializeUser((phone, done) => {
    User.findUserByPhone(phone, (err, user) => {
        done(err, user);
    });
});

export default router;
