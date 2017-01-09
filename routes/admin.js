var express = require('express');
var router = express.Router();
var User = require('../model/User');
var bcrypt = require('bcrypt');
var saltRounds = require('../config/salt');
var Logistics = require('../model/Logistics');

router.get('/', function (req, res, next) {
    if (!res.locals.user) {
        req.flash('error_msg', '用户未登录');
        res.redirect('/login');
        return;
    }
    // 是管理员
    if (res.locals.user.admin) {
        User.findAll(function (err, rows) {
            if (err) {
                req.flash('error_msg', '拉取用户信息失败');
                res.redirect('/admin');
                return;
            }
            res.render('admin', {
                title: '后台管理',
                users: rows
            });
        });
    } else {
        // 普通用户
        Logistics.findByUserId(res.locals.user.id, function (err, rows) {
            if (err) {
                req.flash('error_msg', '拉取用户物流失败');
                res.redirect('/admin');
                return;
            }
            res.render('admin', {
                title: '后台管理',
                logistics: rows
            });
        });
    }

});

router.get('/user', function (req, res, next) {
    if (!res.locals.user) {
        req.flash('error_msg', '用户未登录');
        res.redirect('/login');
        return;
    }
    res.render('user', {title: '用户信息修改'});
});

// 修改密码
router.get('/user/password', function (req, res, next) {
    if (!res.locals.user) {
        req.flash('error_msg', '用户未登录');
        res.redirect('/login');
        return;
    }
    res.render('password', {title: '修改密码'});
});

router.get('/publish', function (req, res, next) {
    if (!res.locals.user) {
        req.flash('error_msg', '用户未登录');
        res.redirect('/login');
        return;
    }
    res.render('publish', {title: '发布物流信息'});
});


router.get('/update/:id', function (req, res, next) {
    if (!res.locals.user) {
        req.flash('error_msg', '用户未登录');
        res.redirect('/login');
        return;
    }
    Logistics.findDetailById(req.params.id, function (err, rows) {
        if (err) {
            req.flash('error_msg', '拉取物流详情失败');
            res.redirect(req.get('referer'));
            return;
        }
        Logistics.findById(req.params.id, function (err, logistics) {
            if (err) {
                req.flash('error_msg', '拉取物流失败');
                res.redirect(req.get('referer'));
                return;
            }
            res.render('update', {
                title: '物流详情更新',
                detail: rows,
                logistics: logistics[0]
            });
        });
    });
});

router.post('/update', function (req, res, next) {
    Logistics.update(req.body.action, req.body.id, function (err, row) {
        if (err) {
            req.flash('error_msg', '添加失败');
            res.redirect('/admin');
            return;
        }
        if (row) {
            req.flash('success_msg', '添加成功');
            res.redirect(req.get('referer'));
        }
    });
});

// 已签收
router.post('/finish', function (req, res, next) {
    Logistics.finish(req.body.id, function (err, row) {
        if (err) {
            req.flash('error_msg', '签收失败');
            res.redirect('/admin/update');
            return;
        }
        if (row) {
            req.flash('success_msg', '签收成功');
            res.redirect(req.get('referer'));
        }
    });
});

// 个人资料修改
router.post('/user/update', function (req, res, next) {
    User.update(req.body.name, req.body.sex, req.body.email, req.body.address, req.body.id, function (err, row) {
        if (err) {
            if (err === '用户信息未修改') {
                req.flash('error_msg', err);
            } else {
                req.flash('error_msg', '修改失败');
            }
            res.redirect('/admin/user');
            return;
        }
        if (row) {
            req.flash('success_msg', '修改成功');
            res.redirect('/admin/user');
        }
    });
});

// 修改密码
router.post('/user/password', function (req, res, next) {
    bcrypt.hash(req.body.password, saltRounds).then(function (hash) {
        User.password(hash, req.body.id, function (err, row) {
            if (err) {
                req.flash('error_msg', '修改失败');
                res.redirect('/admin/user/password');
                return;
            }
            if (row) {
                req.flash('success_msg', '修改成功');
                res.redirect('/admin/user');
            }
        });
    });

});

router.post('/publish', function (req, res, next) {
    Logistics.publish(req.body.title, req.body.describe, req.body.id, function (err, row) {
        if (err) {
            req.flash('error_msg', '发布失败');
            res.redirect('/admin/publish');
            return;
        }
        if (row) {
            req.flash('success_msg', '发布成功');
            res.redirect('/admin');
        }
    });
});

// 提升该用户为管理员
router.post('/upgrade', function (req, res, next) {
    User.upgrade(req.body.id, function (err, row) {
        if (err) {
            req.flash('error_msg', '修改失败');
            res.redirect('/admin');
            return;
        }
        if (row) {
            req.flash('success_msg', '修改成功');
            res.redirect('/admin');
        }
    })
});

// 删除用户
router.post('/delete', function (req, res, next) {
    User.delete(req.body.id, function (err, row) {
        if (err) {
            req.flash('error_msg', '删除失败');
            res.redirect('/admin');
            return;
        }
        if (row) {
            req.flash('success_msg', '删除成功');
            res.redirect('/admin');
        }
    })
});

module.exports = router;
