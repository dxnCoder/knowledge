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
//后台相关的接口....

//课程类型
_rotr.apis.courseType = function() {
    var res={};
    var ctx = this;
    var co = $co(function* () {

        var sqlstr="select ClassId,ClassName from class";
        var dat={};
        var rows=yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!rows)throw Error("失败");
        console.log(rows);
        dat= rows;
        ctx.body = dat;
        return ctx;
    });
    return co;
};

_rotr.apis.courseTypeadd = function() {//课程类型添加
    var res={};
    var ctx = this;
    var co = $co(function* () {
        var id = ctx.query.id || ctx.request.body.id;
        var name = ctx.query.name || ctx.request.body.name;
        var sqlstr="insert into class set ClassId='"+id+"',ClassName='"+name+"'";
        var dat={};
        var regResult;
        var rows=yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!rows)throw Error("失败");
        else{
            regResult=1;
        }
        dat= regResult;
        ctx.body = dat;
        return ctx;
    });
    return co;
};


_rotr.apis.videoType = function() {//视频类型
    var res={};
    var ctx = this;
    var co = $co(function* () {

        var sqlstr="SELECT VideoclassId,VideoclassName,ClassName FROM videoclass,class where" +
            " videoclass.ClassId=class.ClassId";
        var dat={};
        var rows=yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!rows)throw Error("失败");

        dat= rows;
        ctx.body = dat;
        return ctx;
    });
    return co;
};

_rotr.apis.videoSelect = function() {//视频查询
    var res={};
    var ctx = this;
    var co = $co(function* () {
        var name = ctx.query.ClassName || ctx.request.body.ClassName;
        //var sqlstr="SELECT VideoclassId,VideoclassName,ClassId,ClassName FROM Alltypes ";
        var sqlstr="SELECT VideoclassName FROM Alltypes where ClassName='"+name+"'";
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

_rotr.apis.deletvideoType=function(){//视频类型删除
    var res={};
    var ctx=this;
    var co=$co(function*(){
        var name = ctx.query.name || ctx.request.body.name;
        var regResult;
        var sqlstr="delete FROM videoclass where VideoclassId='"+name+"'";
        var dat={};
        var row=yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!row)throw Error("失败");
        ctx.body=res;
        return ctx;
    });
    return co;
};
//视频类型增加
_rotr.apis.typeAdd = function() {
    var ctx = this;
    var co = $co(function* () {
        var id = ctx.query.id || ctx.request.body.id;
        var name = ctx.query.name || ctx.request.body.name;
        var type = ctx.query.type || ctx.request.body.type;
        var regResult;
        var sqlstr="insert into videoclass set VideoclassId='"+id+"',VideoclassName='"+ name +"',ClassId=(select ClassId from class where ClassName='"+type+"')";
        var dat={};
        var rows=yield _ctnu([_mysql.conn,'query'],sqlstr);

        if(!rows)throw Error("失败");
        else{
            regResult=1;
        }

        dat=(regResult);
        ctx.body = dat;
        return ctx;
    });
    return co;
};


_rotr.apis.video= function() {//视频
    var res={};
    var ctx = this;
    var co = $co(function* () {
        var sqlstr="SELECT VideoId,VideoName,VideoclassName,time,UserName,VideoSyno,VideoPrice,VideoGround,VideoPath" +
            " FROM videoclass,video,user " +
            "where video.videoclassId=videoclass.videoclassId and user.UserId=video.UserId";
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

_rotr.apis.videoUpdate=function(){//视频编辑
    var res={};
    var ctx=this;
    var co=$co(function*(){
        var id = ctx.query.id || ctx.request.body.id;
        var jiage = ctx.query.price || ctx.request.body.price;
        var shangjia = ctx.query.grounding || ctx.request.body.grounding;
        var regResult;
        console.log(id+jiage,shangjia);
        var sqlstr="update video set VideoPrice='"+jiage+"',VideoGround='"+shangjia+"' where VideoId='"+id+"'";
        var dat={};
        var row=yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!row)throw Error("失败");
        else{
            var regResult=1;
        }
        res=regResult;
        ctx.body=res;
        return ctx;
    });
    return co;
};
_rotr.apis.deletvideo=function(){//视频删除
    var res={};
    var ctx=this;
    var co=$co(function*(){
        var name = ctx.query.name || ctx.request.body.name;
        var regResult;
        var sqlstr="delete FROM video where VideoId="+name;
        var dat={};
        var row=yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!row)throw Error("失败");
        ctx.body=res;
        return ctx;
    });
    return co;
};

_rotr.apis.use= function() {//用户
    var res={};
    var ctx=this;
    var co=$co(function*(){
        var sqlstr="select UserId,UserName,UserType FROM user";
        var dat={};
        var row=yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!row)throw Error("失败");

        dat=row;
        ctx.body=dat;
        return ctx;
    });
    return co;
};
_rotr.apis.selectusr=function(){//用户删除准备
    var res={};
    var ctx=this;
    var co=$co(function*(){
        var name = ctx.query.name || ctx.request.body.name;
        var res;
        var sqlstr="select count(*) FROM video where UserId="+name;
        var dat={};
        var row=yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!row)throw Error("失败");
        dat=row[0]['count(*)'];
        console.log(dat);
        ctx.body=dat;
        return ctx;
    });
    return co;
};
_rotr.apis.deleteusr=function(){//用户删除
    var res={};
    var ctx=this;
    var co=$co(function*(){
        var name = ctx.query.name || ctx.request.body.name;
        var sqlstr="delete FROM user where UserId="+name;
        var dat={};
        var row=yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!row)throw Error("失败");
        res=row;
        ctx.body=res;
        return ctx;
    });
    return co;
};
_rotr.apis.Type = function() {//级联列表关联
    var res={};
    var ctx = this;
    var name = ctx.query.name || ctx.request.body.name;
    var co = $co(function* () {
        var sqlstr="select VideoclassName from videoclass where ClassId=" +
            "(select ClassId from class where ClassName='"+name+"')";
        var dat={};
        var rows=yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!rows)throw Error("失败");

        dat= rows;
        console.log(name);
        console.log(dat);
        ctx.body = dat;
        return ctx;
    });
    return co;
};
//导出模块
module.exports = _rotr;
