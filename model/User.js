/**
 * Created by fengyuanzemin on 17/1/4.
 */

var db = require('./../config/db');
//
// function User(name, password) {
//     this.name = name;
//     this.password = password;
// }

var User = {};

// 用户登录
//根据证件号查找用户
User.findUserByPhone = function (phone, callback) {
    var sql = "select * from `user` where phone='" + phone + "';";
    db.exec(sql, '', function (err, rows) {
        if (err) {
            return callback(err);
        }
        //rows是一个对象数组
        callback(err, rows[0]);
    });
};

// 用户注册
User.register = function (phone, password, callback) {
    var sql = "insert into `user` (`phone`, `password`) values ('" + phone + "', '" + password + "');";
    db.exec(sql, '', function (err, res) {
        if (err) {
            return callback(err);
        }
        var sql = "select * from user where id='" + res.insertId + "';";
        db.exec(sql, '', function (err, rows) {
            if (err) {
                return callback(err);
            }
            //rows是一个对象数组
            callback(err, rows[0]);
        });
    })
};

// 用户信息更新
User.update = function (name, password, sex, email, address, id, callback) {
    var sql = "update `user` set name='" + name + "', " +
        "password='" + password + "', sex='" + sex + "', email='" + email + "', " +
        "address='" + address + "' where id=" + id + ";";
    db.exec(sql, '', function (err, res) {
        if (err) {
            return callback(err);
        }
        return callback(err, res.changedRows);
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
    var sql = "delete from `user` where id = " + id;
    console.log(sql)
    db.exec(sql, '', function (err, res) {
        if (err) {
            return callback(err);
        }
        return callback(err, res.affectedRows);
    });
};

// 提升用户为管理员
User.upgrade = function (id, callback) {
    var sql = "update `user` set admin = 1 where id = " + id;
    db.exec(sql, '', function (err, res) {
        if (err) {
            return callback(err);
        }
        return callback(err, res.changedRows);
    });
};

module.exports = User;