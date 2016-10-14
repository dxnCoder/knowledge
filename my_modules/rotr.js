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

//更多的相关查询以及跳转，，（没有技术含量，待改进）

//更多视频

_rotr.apis.more = function() {
    var ctx = this;
    var co = $co(function* () {
        var sqlstr="select VideoSyno,Imgpath,VideoName from mydb.video where VideoPrice = 0";
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
        var sqlstr="select VideoSyno,ImgPath,VideoName from mydb.video where VideoGood > 0";
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
        var sqlstr="select VideoSyno,ImgPath,VideoName from mydb.video where VideoPrice > 1";
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
//课程类型添加
_rotr.apis.courseTypeadd = function() {
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

//视频类型
_rotr.apis.videoType = function() {
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
_rotr.apis.videoSelect = function() {//视频类型查询
    var res={};
    var ctx = this;
    var co = $co(function* () {
        var dat={};
        var VideoclassId = ctx.query.VideoclassId || ctx.request.body.VideoclassId;
        var name = ctx.query.ClassName || ctx.request.body.ClassName;
        var VideoclassName = ctx.query.VideoclassName || ctx.request.body.VideoclassName;
        var mianfei = ctx.query.mianfei || ctx.request.body.mianfei;
        var fufei = ctx.query.fufei || ctx.request.body.fufei;
        var zuixin = ctx.query.zuixin || ctx.request.body.zuixin;
        var remen = ctx.query.remen || ctx.request.body.remen;
        //var sqlstr="SELECT VideoclassId,VideoclassName,ClassId,ClassName FROM Alltypes ";
        if(VideoclassName){
            var sqlstr1="select VideoclassId from videoclass where VideoclassName='"+VideoclassName+"'";
            var rows=yield _ctnu([_mysql.conn,'query'],sqlstr1);
        }
        if(name){
            var sqlstr="SELECT VideoclassName,VideoclassId FROM videoclass where ClassId=(select ClassId from class where ClassName='"+name+"')";
            var rows=yield _ctnu([_mysql.conn,'query'],sqlstr);
        }
        if(VideoclassId){
            var sqlstr2="select * from video where VideoclassId='"+VideoclassId+"' and VideoGround='是'";
            var rows=yield _ctnu([_mysql.conn,'query'],sqlstr2);
        }
        if(mianfei){
            var sqlstr3="select * from video where VideoclassId='"+mianfei+"' and VideoGround='是' and VideoPrice='0'";
            var rows=yield _ctnu([_mysql.conn,'query'],sqlstr3);
        }
        if(fufei){
            var sqlstr4="select * from video where VideoclassId='"+fufei+"' and VideoGround='是' and VideoPrice>'0'";
            var rows=yield _ctnu([_mysql.conn,'query'],sqlstr4);
        }
        if(zuixin){
            var sqlstr5="select * from video where VideoclassId='"+zuixin+"' and VideoGround='是' order by time desc";
            var rows=yield _ctnu([_mysql.conn,'query'],sqlstr5);
        }
        if(remen){
            var sqlstr6="select * from video where VideoclassId='"+remen+"' and VideoGround='是' order by OverPeople desc";
            var rows=yield _ctnu([_mysql.conn,'query'],sqlstr6);
            console.log(rows);
        }
        if(!rows)throw Error("失败");

        dat= rows;
        console.log(dat);
        ctx.body = dat;
        return ctx;
    });
    return co;
};

_rotr.apis.Select = function() {//视频个数查询
    var res={};
    var ctx = this;
    var co = $co(function* () {
        var dat={};
        var VideoclassId = ctx.query.VideoclassId || ctx.request.body.VideoclassId;
        var sqlstr="select count(*) as 总数 from video where VideoclassId='"+VideoclassId+"' and VideoGround='是'";
        var rows=yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!rows)throw Error("失败");

        dat= rows;
        console.log(dat);
        ctx.body = dat;
        return ctx;
    });
    return co;
};

//视频类型删除准备
_rotr.apis.selectvideoType=function(){
    var res={};
    var ctx=this;
    var co=$co(function*(){
        var name = ctx.query.name || ctx.request.body.name;
        var regResult;
        var sqlstr="select count(*) FROM video where VideoclassId='"+name+"'";
        var dat={};
        var row=yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!row)throw Error("失败");
        dat=row[0]['count(*)'];
        ctx.body=dat;
        return ctx;
    });
    return co;
};

//视频类型删除
_rotr.apis.deletvideoType=function(){
    var res={};
    var ctx=this;
    var co=$co(function*(){
        var name = ctx.query.name || ctx.request.body.name;
        var regResult;
        var sqlstr="delete FROM videoclass where VideoclassId='"+name+"'";
        var dat={};
        var row=yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!row)throw Error("失败");
        else{
            regResult=1;
        }
        dat=(regResult);
        ctx.body=dat;
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

_rotr.apis.xianshi= function() {//视频显示
    var res={};
    var ctx = this;
    var co = $co(function* () {
        var dat={};
        var id = ctx.query.VideoclassId || ctx.request.body.VideoclassId;
        var ClassName = ctx.query.ClassName || ctx.request.body.ClassName;
        if(id){
            var sqlstr="SELECT VideoName,VideoSyno,VideoPrice,VideoGood,OverPeople," +
                "VideoPath,ImgPath FROM video where VideoGround='是' and VideoclassId='"+id+"'";
            var rows=yield _ctnu([_mysql.conn,'query'],sqlstr);}
        if(ClassName){
            var sqlstr1="select * from videoclass left join class on videoclass.ClassId=class.ClassId and ClassName='"+ClassName+"'" +
                "inner join video on videoclass.VideoclassId=video.VideoclassId and VideoGround='是'";
            var rows=yield _ctnu([_mysql.conn,'query'],sqlstr1);
        }
        if(!rows)throw Error("失败");
        dat= rows;
        console.log(dat);
        ctx.body = dat;
        return ctx;
    });
    return co;
};


_rotr.apis.upload= function() {//视频上传
    var res={};
    var ctx = this;
    var co = $co(function* () {
        var VideoName = ctx.query.VideoName || ctx.request.body.VideoName;
        var VideoSyno=ctx.query.VideoSyno || ctx.request.body.VideoSyno;
        var VideoPrice = ctx.query.VideoPrice || ctx.request.body.VideoPrice;
        var time = ctx.query.time || ctx.request.body.time;
        var VideoclassId = ctx.query.VideoclassId || ctx.request.body.VideoclassId;
        var VideoPath = ctx.query.VideoPath || ctx.request.body.VideoPath;
        var ImgPath = ctx.query.ImgPath || ctx.request.body.ImgPath;
        var UserId = ctx.query.UserId || ctx.request.body.UserId;
        var sqlstr="insert into video (VideoName,VideoSyno,VideoPrice,time,VideoGround,VideoclassId,VideoPath,ImgPath,UserId) values ('"+VideoName+"','"+VideoSyno+"','"+VideoPrice+"','"+time+"','否','"+VideoclassId+"','"+VideoPath+"','"+ImgPath+"','"+UserId+"')";
        var dat={};
        var rows=yield _ctnu([_mysql.conn,'query'],sqlstr);
        console.log("视频名称："+VideoName+"价格："+VideoPrice+"时间："+time+"类型ID:"+VideoclassId+"视频路径："+VideoPath+"图片路径："+ImgPath+"用户："+UserId);
        if(!rows)throw Error("失败");
        else{
            var regResult=1;
        }

        dat=regResult;
        ctx.body = dat;
        return ctx;
    });
    return co;
};


_rotr.apis.video= function() {//视频管理
    var res={};
    var ctx = this;
    var co = $co(function* () {
        var id = ctx.query.VideoclassId || ctx.request.body.VideoclassId;
        var sqlstr="SELECT VideoId,VideoName,VideoclassName,time,UserName,VideoSyno,VideoPrice,VideoGround,VideoPath" +
            " FROM videoclass,video,user " +
            "where video.videoclassId=videoclass.videoclassId and user.UserId=video.UserId and VideoGround='是'";
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

_rotr.apis.video1= function() {//视频管理
    var res={};
    var ctx = this;
    var co = $co(function* () {
        var sqlstr="SELECT VideoId,VideoName,VideoclassName,time,UserName,VideoSyno,VideoPrice,VideoGround,VideoPath" +
            " FROM videoclass,video,user " +
            "where video.videoclassId=videoclass.videoclassId and user.UserId=video.UserId and VideoGround='否'";
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

//视频编辑
_rotr.apis.videoUpdate=function(){
    var res={};
    var ctx=this;
    var co=$co(function*(){
        var id = ctx.query.id || ctx.request.body.id;
        var jiage = ctx.query.price || ctx.request.body.price;
        var shangjia = ctx.query.grounding || ctx.request.body.grounding;
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

//视频删除
_rotr.apis.deletvideo=function(){
    var res={};
    var ctx=this;
    var co=$co(function*(){
        var name = ctx.query.name || ctx.request.body.name;
        var dat={};
        var sqlstr="delete FROM video where VideoId="+name;
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

//用户
_rotr.apis.use= function() {
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


//用户删除准备
_rotr.apis.selectusr=function(){
    var res={};
    var ctx=this;
    var co=$co(function*(){
        var dat={};
        var name = ctx.query.name || ctx.request.body.name;
        var res;
        var sqlstr="select count(*) FROM video where UserId="+name;
        var row=yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!row)throw Error("失败");
        dat=row[0]['count(*)'];
        console.log(dat);
        ctx.body=dat;
        return ctx;
    });
    return co;
};


//用户删除
_rotr.apis.deleteusr=function(){
    var res={};
    var ctx=this;
    var co=$co(function*(){
        var name = ctx.query.name || ctx.request.body.name;
        var sqlstr="delete FROM user where UserId="+name;
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


//级联列表关联
_rotr.apis.Type = function() {
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


//视频简介接口
_rotr.apis.videoMessage = function(){
  var ctx =this;
    var ImgPath = ctx.query.sqlImg || ctx.request.body.sqlImg;
    var co = $co(function*(){
        var sqlstr="select VideoId from mydb.video where ImgPath = '"+ImgPath+"'";
        var rows=yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!rows)throw Error("失败");
       //通过上边获取视频对应ID 定义ID为aaa
       // 通过ID对数据库进行二次多表查询指定属性
        var aaa=rows[0]['VideoId'];
        var sqlstr1="select VideoName,VideoSyno,Content from video v left join assess a on a.VideoId=v.VideoId where v.VideoId='"+aaa+"'";
        var rows1=yield _ctnu([_mysql.conn,'query'],sqlstr1);
        if(!rows1)throw Error("失败");

        console.log("rows1",rows1);
        //console.log('>>>>>ImgPath',ImgPath);
        ctx.body = rows1;
        return ctx;
    });
    return co;
};
//视频简介接口的代码，，

//该接口与上边接口一样，，只是传的参数不一样，，来控制video播放
_rotr.apis.videoPlay = function(){
    var ctx =this;
    var ImgPath = ctx.query.sqlImg || ctx.request.body.sqlImg;
    var co = $co(function*(){
        var sqlstr="select VideoId from mydb.video where ImgPath = '"+ImgPath+"'";
        var rows=yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!rows)throw Error("失败");
        //通过上边获取视频对应ID 定义ID为aaa
        // 通过ID对数据库进行二次多表查询指定属性
        var aaa=rows[0]['VideoId'];
        var sqlstr1="select VideoPath from video v left join assess a on a.VideoId=v.VideoId where v.VideoId='"+aaa+"'";
        var rows1=yield _ctnu([_mysql.conn,'query'],sqlstr1);
        if(!rows1)throw Error("失败");

        console.log("rows1",rows1);
        //console.log('>>>>>ImgPath',ImgPath);
        ctx.body = rows1;
        return ctx;
    });
    return co;
};

//账号详情接口，，
_rotr.apis.personCenter = function(){
    var ctx = this;
    var co = $co(function * () {

        var userId = ctx.query.id || ctx.request.body.id;
        var userName=ctx.query.name || ctx.request.body.name;
        var userNick=ctx.query.nick || ctx.request.body.nick;
        console.log("测试id",userId);
        console.log(">>>nick",userName);
        var dat={};
        var sqlstr="select * from user where UserId="+userId+" and UserName='"+userName+"'";
        var rows = yield _ctnu([_mysql.conn,'query'],sqlstr);
        if (rows.length==0){
            var sqlstr2="insert into user(UserId,UserName,UserNick,UserType) values('"+userId+"','"+userName+"','"+userNick+"','user')";
            var rows = yield _ctnu([_mysql.conn, 'query'], sqlstr2);
        }else{
            if(rows['UserNick']!=userNick){
                var sqlstr3="update user set UserNick='"+userNick+"'where UserId='"+userId+"'";
                var rows = yield _ctnu([_mysql.conn,'query'],sqlstr3);
            }
        }
        console.log('返回数据',rows.length);
        dat.Usr = rows[0];
        ctx.body = dat;
        return ctx;
    });
    return co;
};

//导出模块
module.exports = _rotr;
