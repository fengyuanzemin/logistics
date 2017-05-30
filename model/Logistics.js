/**
 * Created by fengyuanzemin on 17/1/4.
 */
import db from './../config/db';

export default {
    // 发布物流
    publish: async (title, des, id, callback) => {
        const sql = 'insert into logistics set ?';
        db.exec(sql, { title, describe: des, userId: id }, (err, res) => {
            if (err) {
                return callback(err);
            }
            const sqlInsertDetail = 'insert into detail set ?';
            db.exec(sqlInsertDetail, { action: '开始', logisticsId: res.insertId }, (error, response) => {
                if (err) {
                    return callback(err);
                }
                return callback(err, response.insertId);
            });
        });
    },
    // 根据用户找物流
    findByUserId: (userId, callback) => {
        const sql = 'select * from `logistics` where userId = ?';
        db.exec(sql, [userId], (err, rows) => {
            if (err) {
                return callback(err);
            }
            return callback(err, rows);
        });
    },
    // 根据物流Id找物流详情
    findDetailById: (id, callback) => {
        const sql = 'select * from `detail` where logisticsId = ?';
        db.exec(sql, [id], (err, rows) => {
            if (err) {
                return callback(err);
            }
            return callback(err, rows);
        });
    },
    // 更新物流详情
    update: (action, id, callback) => {
        const sql = 'insert into `detail` set ?';
        db.exec(sql, { action, logisticsId: id }, (err, rows) => {
            if (err) {
                return callback(err);
            }
            return callback(err, rows.insertId);
        });
    },
    // 查找所有物流信息
    findAll: (callback) => {
        const sql = 'select * from `logistics`';
        db.exec(sql, '', (err, rows) => {
            if (err) {
                return callback(err);
            }
            return callback(err, rows);
        });
    },

    // 根据id找物流信息
    findById: (id, callback) => {
        const sql = 'select * from `logistics` where id = ?';
        db.exec(sql, [id], (err, rows) => {
            if (err) {
                return callback(err);
            }
            return callback(err, rows);
        });
    },
    // 签收
    finish: (id, callback) => {
        const sql = 'update `logistics` set `finish` = ? where id = ?';
        db.exec(sql, [1, id], (err) => {
            if (err) {
                return callback(err);
            }
            const sqlInsert = 'insert into `detail` set ?';
            db.exec(sqlInsert, { action: '签收', logisticsId: id }, (error, rows) => {
                if (error) {
                    return callback(error);
                }
                return callback(error, rows.insertId);
            });
        });
    },
};
