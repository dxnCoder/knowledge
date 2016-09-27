/*http路由分发
接口模式server/:app/:api
*/

var _rotr = {};

//http请求的路由控制
_rotr = new $router();




//访问的请求
_rotr.get('api', '/api/:apiname', apihandler);
_rotr.post('api', '/api/:apiname', apihandler);
var _mysql=require('./_mysql');
var _ctnu = require('./ctnu');




/*所有api处理函数都收集到这里
必须是返回promise
各个api处理函数用promise衔接,return传递ctx
*/
_rotr.apis = {};

/*处理Api请求
默认tenk的api直接使用
每个app的独立api格式appname_apiname
*/
function * apihandler(next) {
    var ctx = this;
    var apinm = ctx.params.apiname;

    console.log('API RECV:', apinm);

    //匹配到路由函数,路由函数异常自动返回错误,创建xdat用来传递共享数据
    var apifn = _rotr.apis[apinm];
    ctx.xdat = {
        apiName: apinm
    };

    if (apifn && apifn.constructor == Function) {
        yield apifn.call(ctx, next).then(function() {

            //所有接口都支持JSONP,限定xx.x.xmgc360.com域名
            var jsonpCallback = ctx.query.callback || ctx.request.body.callback;
            if (jsonpCallback && ctx.body) {
                if (_cfg.regx.crossDomains.test(ctx.hostname)) {
                    ctx.body = ctx.query.callback + '(' + JSON.stringify(ctx.body) + ')';
                };
            };

        }, function(err) {
            ctx.body = __newMsg(__errCode.APIERR, [err.message, 'API proc failed:' + apinm + '.']);
            __errhdlr(err);
        });
    } else {
        ctx.body = __newMsg(__errCode.NOTFOUND, ['服务端找不到接口程序', 'API miss:' + apinm + '.']);
    };

    yield next;
};




/*测试接口,返回请求的数据
 */
_rotr.apis.test = function() {
    var ctx = this;
    var co = $co(function * () {

        var resdat = {
            query: ctx.query.nick,
            body: ctx.body,
        };

        ctx.body = __newMsg(1, 'ok', resdat);
        return ctx;
    });
    return co;
};

//注册接口
_rotr.apis.reg = function() {
    var ctx = this;
    var co = $co(function* () {
        var res = yield _fns.getUidByReg(ctx);
        var regResult;
        var sqlstr="insert into user set UserName='"+ phone +"',UserPwd=MD5('"+ pw +"'),UserType='user'";
        var rows=yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!rows)throw Error("失败");
        else{
            regResult=1;
        }

        var res=(regResult);
        ctx.body = res;
        return ctx;
    });
    return co;
};
//注册查询用户名是否重复
_rotr.apis.regSel = function() {
    var ctx = this;
    var co = $co(function* () {
        var phone = ctx.query.phone || ctx.request.body.phone;
        var regResult;
        var sqlstr="select count(*) from user where UserName='"+phone+"'";
        var rows=yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!rows)throw Error("失败");

        regResult= rows[0]['count(*)'];
        var res=(regResult);
        console.log(regResult,phone);
        ctx.body = res;
        return ctx;
    });
    return co;
};

//登录接口
_rotr.apis.login = function() {
    var ctx = this;
    var co = $co(function* () {
        var res = yield _fns.getUidByLogin(ctx);
        ctx.body = res;
        return ctx;
    });
    return co;
};
//更多的相关查询以及跳转，，（没有技术含量，待改进）

//更多视频

_rotr.apis.more = function() {
    var ctx = this;
    var co = $co(function* () {
        var sqlstr="select Imgpath,VideoName from mydb.video where VideoclassId='b00001'";
        var dat={};
        var rows=yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!rows)throw Error("失败");
        dat= rows;
        console.log(dat);
        ctx.body = dat;
        return ctx;
    });
    return co;
};

_rotr.apis.more1 = function() {
    var ctx = this;
    var co = $co(function* () {
        var sqlstr="select ImgPath,VideoName from mydb.video where VideoGood > 0";
        var dat={};
        var rows=yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!rows)throw Error("失败");
        dat= rows;
        console.log(dat);
        ctx.body = dat;
        return ctx;
    });
    return co;
};

_rotr.apis.more2 = function() {
    var ctx = this;
    var co = $co(function* () {
        var sqlstr="select ImgPath,VideoName from mydb.video where VideoPrice > 1";
        var dat={};
        var rows=yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!rows)throw Error("失败");
        dat= rows;
        console.log(dat);
        ctx.body = dat;
        return ctx;
    });
    return co;
};

//导出模块
module.exports = _rotr;
