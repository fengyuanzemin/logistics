/**
 * Created by fengyuanzemin on 17/1/4.
 */
var db = require('./../config/db');
var Logistics = {};

// 发布物流
Logistics.publish = function (title, des, id, callback) {
    var sql = "insert into logistics (`title`, `describe`, `userId`) values ('" + title + "','" + des + "'," + id + ")";
    db.exec(sql, '', function (err, res) {
        if (err) {
            return callback(err)
        }
        var sqlInsertDetail = "insert into detail (`action`, `logisticsId`) values ('" + '开始' + "', " + res.insertId + ")";
        db.exec(sqlInsertDetail, '', function (err, res) {
            if (err) {
                return callback(err)
            }
            return callback(err, res.insertId);
        });
    });
};

// 根据用户找物流
Logistics.findByUserId = function (userId, callback) {
    var sql = "select * from `logistics` where userId = " + userId;
    db.exec(sql, '', function (err, rows) {
        if (err) {
            return callback(err);
        }
        return callback(err, rows);
    });
};

// 根据物流Id找物流详情
Logistics.findDetailById = function (id, callback) {
    var sql = "select * from `detail` where logisticsId = " + id;
    db.exec(sql, '', function (err, rows) {
        if (err) {
            return callback(err);
        }
        return callback(err, rows);
    });
};


// 更新物流详情
Logistics.update = function (action, id, callback) {
    var sql = "insert into `detail` (`action`, `logisticsId`) values ('" + action + "', " + id + ");";
    db.exec(sql, '', function (err, rows) {
        if (err) {
            return callback(err);
        }
        return callback(err, rows.insertId);
    });
};

// 查找所有物流信息
Logistics.findAll = function (callback) {
    var sql = "select * from `logistics`";
    db.exec(sql, '', function (err, rows) {
        if (err) {
            return callback(err);
        }
        return callback(err, rows);
    });
};

// 根据id找物流信息
Logistics.findById = function (id, callback) {
    var sql = "select * from `logistics` where id = " + id;
    db.exec(sql, '', function (err, rows) {
        if (err) {
            return callback(err);
        }
        return callback(err, rows);
    });
};

// 签收
Logistics.finish = function (id, callback) {
    var sql = "update `logistics` set `finish` = 1 where id = " + id;
    db.exec(sql, '', function (err, rows) {
        if (err) {
            return callback(err);
        }
        var sqlInsert = "insert into `detail` (`action`, `logisticsId`) " +
            "values ('签收', " + id + ");";
        db.exec(sqlInsert, '', function (err, rows) {
            if (err) {
                return callback(err);
            }
            return callback(err, rows.insertId);
        });
    });
};

module.exports = Logistics;