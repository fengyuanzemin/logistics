/**
 * Created by fengyuanzemin on 17/1/4.
 */

var db = require('./dbhelper');

function User(name, password) {
    this.name = name;
    this.password = password;
}

module.exports = User;

// 用户登录
//根据证件号查找用户
User.findUserByreaderId=function(name, callback){
    var sql="select * from user where name='"+name+"';";
    db.exec(sql,'',function(err,rows){
        if(err){
            return callback(err);
        }
        //rows是一个对象数组
        callback(err,rows[0]);
    });
};

// 用户注册
// User.