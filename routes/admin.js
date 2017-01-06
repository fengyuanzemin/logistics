var express = require('express');
var router = express.Router();
var User = require('../model/User');
var Logistics = require('../model/Logistics');

router.get('/', function (req, res, next) {
    if (!res.locals.user) {
        req.flash('error_msg', '用户未登录');
        res.redirect('/login');
        return;
    }
    Logistics.findByUserId(res.locals.user.id, function (err, rows) {
        if (err) {
            req.flash('error_msg', '拉取用户物流失败');
            res.redirect('/admin');
            return;
        }
        res.render('admin', {
            title: '后台管理',
            logistics: rows
        })
    });
});

router.get('/user', function (req, res, next) {
    if (!res.locals.user) {
        req.flash('error_msg', '用户未登录');
        res.redirect('/login');
        return;
    }
    res.render('user', {title: '用户信息修改'});
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

router.post('/userUpdate', function (req, res, next) {
    User.update(req.body.name, req.body.password, req.body.sex, req.body.email, req.body.address, req.body.id, function (err, row) {
        if (err) {
            req.flash('error_msg', '修改失败');
            res.redirect('/admin/user');
            return;
        }
        if (row) {
            req.flash('success_msg', '修改成功');
            res.redirect('/admin');
        }
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

module.exports = router;
