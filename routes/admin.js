import express from 'express';
import bcrypt from 'bcrypt';
import User from '../model/User';
import Logistics from '../model/Logistics';
import { saltRounds } from '../config/salt';

const router = express.Router();

router.get('/', (req, res) => {
    if (!res.locals.user) {
        req.flash('error_msg', '用户未登录');
        res.redirect('/login');
        return;
    }
    // 是管理员
    if (res.locals.user.admin) {
        User.findAll((err, rows) => {
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
        Logistics.findByUserId(res.locals.user.id, (err, rows) => {
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

router.get('/user', (req, res) => {
    if (!res.locals.user) {
        req.flash('error_msg', '用户未登录');
        res.redirect('/login');
        return;
    }
    res.render('user', { title: '用户信息修改' });
});

// 修改密码
router.get('/user/password', (req, res) => {
    if (!res.locals.user) {
        req.flash('error_msg', '用户未登录');
        res.redirect('/login');
        return;
    }
    res.render('password', { title: '修改密码' });
});

router.get('/publish', (req, res) => {
    if (!res.locals.user) {
        req.flash('error_msg', '用户未登录');
        res.redirect('/login');
        return;
    }
    res.render('publish', { title: '发布物流信息' });
});


router.get('/update/:id', (req, res) => {
    if (!res.locals.user) {
        req.flash('error_msg', '用户未登录');
        res.redirect('/login');
        return;
    }
    Logistics.findDetailById(req.params.id, (err, rows) => {
        if (err) {
            req.flash('error_msg', '拉取物流详情失败');
            res.redirect(req.get('referer'));
            return;
        }
        Logistics.findById(req.params.id, (error, logistics) => {
            if (error) {
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

router.post('/update', (req, res) => {
    Logistics.update(req.body.action, req.body.id, (err, row) => {
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
router.post('/finish', (req, res) => {
    Logistics.finish(req.body.id, (err, row) => {
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
router.post('/user/update', (req, res) => {
    User.update(req.body.name, req.body.sex, req.body.email, req.body.address, req.body.id,
        (err, row) => {
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
router.post('/user/password', (req, res) => {
    if (req.body.password.length < 6 || req.body.password.length > 14) {
        req.flash('error_msg', '密码长度应该在6位到14位之间');
        res.redirect('/admin/user/password');
        return;
    }
    if (!/[A-Z]/.test(req.body.password) || !/[a-z]/.test(req.body.password) || !/\d/.test(req.body.password)) {
        req.flash('error_msg', '密码应该包含大小写字母和数字');
        res.redirect('/admin/user/password');
        return;
    }
    bcrypt.hash(req.body.password, saltRounds).then((hash) => {
        User.password(hash, req.body.id, (err, row) => {
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

router.post('/publish', (req, res) => {
    Logistics.publish(req.body.title, req.body.describe, req.body.id, (err, row) => {
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
router.post('/upgrade', (req, res) => {
    User.upgrade(req.body.id, (err, row) => {
        if (err) {
            req.flash('error_msg', '修改失败');
            res.redirect('/admin');
            return;
        }
        if (row) {
            req.flash('success_msg', '修改成功');
            res.redirect('/admin');
        }
    });
});

// 删除用户
router.post('/delete', (req, res) => {
    User.delete(req.body.id, (err, row) => {
        if (err) {
            req.flash('error_msg', '删除失败');
            res.redirect('/admin');
            return;
        }
        if (row) {
            req.flash('success_msg', '删除成功');
            res.redirect('/admin');
        }
    });
});

export default router;
