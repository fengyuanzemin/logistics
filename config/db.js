/**
 * Created by fengyuanzemin on 17/1/4.
 */
import mysql from 'mysql';
import config from './config';

export default {
    // sql语句执行
    exec: (sql, values, after) => {
        const connection = mysql.createConnection(config);
        connection.connect((err) => {
            if (err) {
                console.error(`error connecting: ${err.stack}`);
            }
            console.log(`connected as id ${connection.threadId}`);

            connection.query(sql || '', values || [], (error, rows) => {
                after(error, rows);
            });
            // 关闭数据库连接
            connection.end();
        });
        connection.on('error', (err) => {
            if (err.errno !== 'ECONNRESET') {
                after('err01', false);
                throw err;
            } else {
                after('err02', false);
            }
        });
    }
};

// 事务连接
// DB.getConnection=function(callback){
//     var connection=mysql.createConnection(option);
//     connection.connect(function(err){
//         if(err){
//             console.error('error connecting: ' + err.stack);
//         }
//         callback(err,connection);
//     });
// };
