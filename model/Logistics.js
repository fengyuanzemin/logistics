/**
 * Created by fengyuanzemin on 17/1/4.
 */
import db from './../config/db';

export default {
    // 发布物流
    publish: (title, des, id, callback) => {
        const sql = "insert into logistics set ?";
        db.exec(sql, {title: title, describe: des, userId: id}, (err, res) => {
            if (err) {
                return callback(err)
            }
            const sqlInsertDetail = "insert into detail set ?";
            db.exec(sqlInsertDetail, {action: '开始', logisticsId: res.insertId}, (err, res) => {
                if (err) {
                    return callback(err)
                }
                return callback(err, res.insertId);
            });
        });
    },
    // 根据用户找物流
    findByUserId: (userId, callback) => {
        const sql = "select * from `logistics` where userId = ?";
        db.exec(sql, [userId], (err, rows) => {
            if (err) {
                return callback(err);
            }
            return callback(err, rows);
        })
    },
    // 根据物流Id找物流详情
    findDetailById: function (id, callback) {
        const sql = "select * from `detail` where logisticsId = ?";
        db.exec(sql, [id], function (err, rows) {
            if (err) {
                return callback(err);
            }
            return callback(err, rows);
        });
    },
    // 更新物流详情
    update: (action, id, callback) => {
        const sql = "insert into `detail` set ?";
        db.exec(sql, {action: action, logisticsId: id}, (err, rows) => {
            if (err) {
                return callback(err);
            }
            return callback(err, rows.insertId);
        });
    },
    // 查找所有物流信息
    findAll: (callback) => {
        const sql = "select * from `logistics`";
        db.exec(sql, '', function (err, rows) {
            if (err) {
                return callback(err);
            }
            return callback(err, rows);
        });
    },

    // 根据id找物流信息
    findById: (id, callback) => {
        const sql = "select * from `logistics` where id = ?";
        db.exec(sql, [id], (err, rows) => {
            if (err) {
                return callback(err);
            }
            return callback(err, rows);
        });
    },
    // 签收
    finish: (id, callback) => {
        const sql = "update `logistics` set `finish` = ? where id = ?";
        db.exec(sql, [1, id], function (err) {
            if (err) {
                return callback(err);
            }
            const sqlInsert = "insert into `detail` set ?";
            db.exec(sqlInsert, {action: '签收', logisticsId: id}, (err, rows) => {
                if (err) {
                    return callback(err);
                }
                return callback(err, rows.insertId);
            });
        });
    },
}
