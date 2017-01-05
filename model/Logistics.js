/**
 * Created by fengyuanzemin on 17/1/4.
 */
var db = require('./../config/db');
var Logistics = {};

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

module.exports = Logistics;