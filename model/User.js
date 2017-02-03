/**
 * Created by fengyuanzemin on 17/1/4.
 */

import db from './../config/db';

export default {
    // 用户登录
    // 根据证件号查找用户
    findUserByPhone: (phone, callback) => {
        const sql = "select * from `user` where phone = ?";
        db.exec(sql, [phone], (err, rows) => {
            if (err) {
                return callback(err);
            }
            //rows是一个对象数组
            callback(err, rows[0]);
        });
    },
    // 用户注册
    register: (phone, password, callback) => {
        const sql = "insert into `user` set ?";
        db.exec(sql, {phone: phone, password: password}, (err, res) => {
            if (err) {
                return callback(err);
            }
            const sql = "select * from user where id= ?";
            db.exec(sql, [res.insertId], (err, rows) => {
                if (err) {
                    return callback(err);
                }
                //rows是一个对象数组
                callback(err, rows[0]);
            });
        })
    },
    // 用户信息更新
    update: (name, sex, email, address, id, callback) => {
        const sql = "select * from `user` where id = ?";
        db.exec(sql, [id], (err, rows) => {
            if (err) {
                return callback(err);
            }
            // 发现提交上来的和原来的不一样
            if (rows[0].name !== name || rows[0].sex !== sex || rows[0].email !== email ||
                rows[0].address !== address) {
                const sqlUpdate = "update `user` set name = ?, sex = ?, email = ?, " +
                    "address = ? where id = ?;";
                db.exec(sqlUpdate, [name, sex, email, address, id], (error, res) => {
                    if (error) {
                        return callback(error);
                    }
                    return callback(error, res.changedRows);
                });
            } else {
                return callback('用户信息未修改');
            }
        });
    },
    // 用户密码更新
    password: (password, id, callback) => {
        const sql = "update `user` set password = ? where id = ?";
        db.exec(sql, [password, id], (error, res) => {
            if (error) {
                return callback(error);
            }
            return callback(error, res.changedRows);
        });
    },
    // 拉取所有用户信息，管理员
    findAll: (callback) => {
        const sql = "select * from `user`";
        db.exec(sql, '', (err, res) => {
            if (err) {
                return callback(err);
            }
            return callback(err, res);
        });
    },

    // 删除用户
    delete: (id, callback) => {
        const sql = "delete from `user` where id = ?";
        db.exec(sql, [id], (err, res) => {
            if (err) {
                return callback(err);
            }
            return callback(err, res.affectedRows);
        });
    },
    // 提升用户为管理员
    upgrade: (id, callback) => {
        const sql = "update `user` set admin = ? where id = ?";
        db.exec(sql, [1, id], (err, res) => {
            if (err) {
                return callback(err);
            }
            return callback(err, res.changedRows);
        });
    }
}
