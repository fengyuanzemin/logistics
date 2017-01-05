var express = require('express');
var router = express.Router();
var Logistics = require('../model/Logistics');

router.get('/', function (req, res, next) {
    if (!res.locals.user) {
        req.flash('error_msg', '用户未登录');
        res.redirect('/login');
        return;
    }
    res.render('admin', {title: '后台管理'})
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

router.post('/userUpdate', function (req, res, next) {

});

router.post('/publish', function (req, res, next) {
    console.log(req.body);
    Logistics.publish(req.body.title, req.body.describe, req.body.id, function (err, row) {
        if(err) {
            req.flash('error_msg', '发布失败');
            res.redirect('/admin/publish');
            console.log(err)
            return;
        }
        if(row) {
            req.flash('success_msg', '发布成功');
            res.redirect('/admin');
        }
    });
});

module.exports = router;
