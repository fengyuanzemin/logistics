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
    var sql = "select * from user where phone='" + phone + "';";
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
    var sql = "insert into user (`phone`, `password`) values ('" + phone + "', '" + password + "')";
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

module.exports = User;