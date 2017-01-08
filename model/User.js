/**
 * Created by fengyuanzemin on 17/1/4.
 */

var db = require('./../config/db');

var User = {};

// 用户登录
//根据证件号查找用户
User.findUserByPhone = function (phone, callback) {
    var sql = "select * from `user` where phone = ?";
    db.exec(sql, [phone], function (err, rows) {
        if (err) {
            return callback(err);
        }
        //rows是一个对象数组
        callback(err, rows[0]);
    });
};

// 用户注册
User.register = function (phone, password, callback) {
    var sql = "insert into `user` set ?";
    db.exec(sql, {phone: phone, password: password}, function (err, res) {
        if (err) {
            return callback(err);
        }
        var sql = "select * from user where id= ?";
        db.exec(sql, [res.insertId], function (err, rows) {
            if (err) {
                return callback(err);
            }
            //rows是一个对象数组
            callback(err, rows[0]);
        });
    })
};

// 用户信息更新
User.update = function (name, sex, email, address, id, callback) {
    var sql = "select * from `user` where id = ?";
    db.exec(sql, [id], function (err, rows) {
        if (err) {
            return callback(err);
        }
        // 发现提交上来的和原来的不一样
        if (rows[0].name !== name || rows[0].sex !== sex || rows[0].email !== email ||
            rows[0].address !== address) {
            var sqlUpdate = "update `user` set name = ?, sex = ?, email = ?, " +
                "address = ? where id = ?;";
            db.exec(sqlUpdate, [name, sex, email, address, id], function (error, res) {
                if (error) {
                    return callback(error);
                }
                return callback(error, res.changedRows);
            });
        } else {
            return callback('用户信息未修改');
        }
    });
};

// 用户密码更新
User.password = function (password, id, callback) {
    var sql = "update `user` set password = ? where id = ?";
    db.exec(sql, [password, id], function (error, res) {
        if (error) {
            return callback(error);
        }
        return callback(error, res.changedRows);
    });
};

// 拉取所有用户信息，管理员
User.findAll = function (callback) {
    var sql = "select * from `user`";
    db.exec(sql, '', function (err, res) {
        if (err) {
            return callback(err);
        }
        return callback(err, res);
    });
};

// 删除用户
User.delete = function (id, callback) {
    var sql = "delete from `user` where id = ?";
    db.exec(sql, [id], function (err, res) {
        if (err) {
            return callback(err);
        }
        return callback(err, res.affectedRows);
    });
};

// 提升用户为管理员
User.upgrade = function (id, callback) {
    var sql = "update `user` set admin = ? where id = ?";
    db.exec(sql, [1, id], function (err, res) {
        if (err) {
            return callback(err);
        }
        return callback(err, res.changedRows);
    });
};

module.exports = User;