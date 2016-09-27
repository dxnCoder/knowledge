/**
 * Created by yyl15 on 2016/9/6.
 */
/**
 * Created by 13275 on 2016/9/2.
 */

var _mysql ={};

var conn =_mysql.conn = $mysql.createConnection({
    host:"115.159.192.48",
    user:"root",
    password:"dxn19930907",
    database:"mydb"
});
conn.connect();

module.exports = _mysql;

