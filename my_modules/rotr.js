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
        var sqlstr="select VideoId,OverPeople,Imgpath,VideoName from mydb.video where VideoPrice = 0";
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
        var sqlstr="select VideoId,OverPeople,ImgPath,VideoName,VideoPrice from mydb.video where Purchase > 0";
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
        var sqlstr="select VideoId,OverPeople,ImgPath,VideoName,VideoPrice from mydb.video where VideoPrice > 1";
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

_rotr.apis.mianfei = function() {
    var ctx = this;
    var co = $co(function* () {
        var sqlstr="select VideoId,VideoName,ImgPath from video where VideoPrice='0' and VideoGround='是' order by OverPeople limit 4";
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

_rotr.apis.changxiao = function() {
    var ctx = this;
    var co = $co(function* () {
        var sqlstr="select VideoId,VideoName,ImgPath,VideoPrice from video where VideoPrice>'0' and VideoGround='是' order by Purchase limit 4";
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

_rotr.apis.haoke = function() {
    var ctx = this;
    var co = $co(function* () {
        var sqlstr="select VideoId,VideoName,ImgPath,VideoPrice from video where VideoGround='是' order by OverPeople and VideoPrice='0' limit 4";
        var dat={};
        var rows=yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!rows)throw Error("失败");
        dat= rows;
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
        var id = ctx.query.ClassId || ctx.request.body.ClassId;
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
        if(id){
            var sqlstr="SELECT VideoclassName,VideoclassId FROM videoclass where ClassId='"+id+"'";
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
        var ClassName=ctx.query.ClassName || ctx.request.body.ClassName;
        if(VideoclassId){
            var sqlstr="select count(*) as 总数 from video where VideoclassId='"+VideoclassId+"' and VideoGround='是'";
            var rows=yield _ctnu([_mysql.conn,'query'],sqlstr);}
        if(ClassName){
            var sqlstr1="select ClassId from class where ClassName='"+ClassName+"'";
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
        var ClassId = ctx.query.ClassId || ctx.request.body.ClassId;
        if(id){
            var sqlstr="SELECT VideoName,VideoSyno,VideoPrice,VideoGood,OverPeople," +
                "VideoPath,ImgPath FROM video where VideoGround='是' and VideoclassId='"+id+"'";
            var rows=yield _ctnu([_mysql.conn,'query'],sqlstr);}
        if(ClassId){
            var sqlstr1="select * from videoclass " +
                "inner join video on videoclass.VideoclassId=video.VideoclassId and VideoGround='是' and ClassId='"+ClassId+"'";
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


//可新增判断语句，判断是否上传过
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




_rotr.apis.uploadPage= function() {//我的上传
    var res={};
    var ctx = this;
    var co = $co(function* () {
        var userId = ctx.query.userId || ctx.request.body.userId;
        var sqlstr="select VideoId,VideoName,VideoSyno,VideoPrice,time,VideoGround,VideoPath,ImgPath from video where UserId='"+userId+"'";
        var dat={};
        var rows=yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!rows)throw Error("失败");
        dat=rows;
        console.log(dat);
        ctx.body = dat;
        return ctx;
    });
    return co;
};

_rotr.apis.UserType = function(){//用户类型查询
    var ctx = this;
    var co = $co(function * () {
        var userId = ctx.query.id || ctx.request.body.id;
        var dat={};
        var sqlstr="select ImgPath,UserNick,UserType,UserName from user where UserId='"+userId+"'";
        var rows = yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!rows)throw Error("失败");
        dat = rows;
        console.log(dat);
        ctx.body = dat;
        return ctx;
    });
    return co;
};

_rotr.apis.selectshopp = function(){//添加准备
    var ctx = this;
    var co = $co(function * () {
        var userId = ctx.query.userId || ctx.request.body.userId;
        var videoId=ctx.query.videoId || ctx.request.body.videoId;
        var dat={};
        var sqlstr="select * from orderinfo where VideoId='"+videoId+"' and UserId='"+userId+"'";
        var rows = yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!rows)throw Error("失败");
        dat=rows;
        ctx.body = dat;
        return ctx;
    });
    return co;
};


_rotr.apis.shopping = function(){//购物车添加
    var ctx = this;
    var co = $co(function * () {
        var userId = ctx.query.userId || ctx.request.body.userId;
        var videoId=ctx.query.videoId || ctx.request.body.videoId;
        var dat={};
        var sqlstr="insert into orderinfo (VideoId,UserId) values ('"+videoId+"','"+userId+"')";
        var rows = yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!rows)throw Error("失败");
        else{
            var result=1;
        }
        dat=result;
        ctx.body = dat;
        return ctx;
    });
    return co;
};

_rotr.apis.selectshopping = function(){//购物车查询
    var ctx = this;
    var co = $co(function * () {
        var userId = ctx.query.id || ctx.request.body.id;
        var dat={};
        var sqlstr="select orderinfo.VideoId as VideoId,orderinfo.UserId as UserId,VideoName,VideoPrice,ImgPath " +
            "from orderinfo,video where orderinfo.VideoId=video.VideoId and orderinfo.UserId='"+userId+"' and OrderId is null";
        var rows = yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!rows)throw Error("失败");
        dat = rows;
        ctx.body = dat;
        return ctx;
    });
    return co;
};

_rotr.apis.deletshopping=function(){//购物车删除
    var res={};
    var ctx=this;
    var co=$co(function*(){
        var name= ctx.query.name || ctx.request.body.name;
        var id= ctx.query.id || ctx.request.body.id;
        var dat={};
        if(name){
            var sqlstr="delete FROM orderinfo where VideoId="+name;
            var row=yield _ctnu([_mysql.conn,'query'],sqlstr);
        }
        if(id){
            var sqlstr1="delete FROM orderinfo where UserId="+id;
            var row=yield _ctnu([_mysql.conn,'query'],sqlstr1);
        }
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

_rotr.apis.order=function(){//添加订单
    var res={};
    var ctx=this;
    var co=$co(function*(){
        var videoid= ctx.query.videoid || ctx.request.body.videoid;
        var userid= ctx.query.userid || ctx.request.body.userid;
        var time= ctx.query.time || ctx.request.body.time;
        var OrderId= ctx.query.orderId || ctx.request.body.orderId;
        var price= ctx.query.price || ctx.request.body.price;
        var dat={};
        console.log(time);
        for (var i=0;i<videoid.length;i++){
            var sqlstr="update orderinfo set OrderId='"+OrderId+"' where VideoId='"+videoid[i]+"' and UserId='"+userid+"'";
            var row=yield _ctnu([_mysql.conn,'query'],sqlstr);
            if(!row)throw Error("失败");
        }
        var sqlstr1="insert into mydb.`order` values ('"+OrderId+"','"+userid+"','"+time+"','"+price+"','否')";
        var rows=yield _ctnu([_mysql.conn,'query'],sqlstr1);
        if(!rows)throw Error("失败");
        else{
            var regResult=1;
        }
        res=regResult;
        ctx.body=res;
        return ctx;
    });
    return co;
};

_rotr.apis.selectorder=function(){//查询订单
    var res={};
    var ctx=this;
    var co=$co(function*(){
        var userid= ctx.query.userid || ctx.request.body.userid;
        var orderid= ctx.query.orderid || ctx.request.body.orderid;
        var id= ctx.query.id || ctx.request.body.id;
        var Ordeid= ctx.query.Ordeid || ctx.request.body.Ordeid;
        console.log(orderid);
        var dat={};
        if(userid){
            var sqlstr1="select * from mydb.`order` where UserId='"+userid+"'";
            var rows=yield _ctnu([_mysql.conn,'query'],sqlstr1);
            if(!rows)throw Error("失败");
        }
        if(id){
            var sqlstr3="select * from mydb.`order` where UserId='"+id+"' and OrderType='是'";
            var rows=yield _ctnu([_mysql.conn,'query'],sqlstr3);
            if(!rows)throw Error("失败");
        }
        if(Ordeid){
            var sqlstr4="select * from mydb.`order` where UserId='"+Ordeid+"' and OrderType='否'";
            var rows=yield _ctnu([_mysql.conn,'query'],sqlstr4);
            if(!rows)throw Error("失败");
        }
        if(orderid){
            var sqlstr2="select VideoId,VideoName,VideoPrice,ImgPath from video where VideoId in(select VideoId from orderinfo where OrderId='"+orderid+"')";
            var rows=yield _ctnu([_mysql.conn,'query'],sqlstr2);
            if(!rows)throw Error("失败");
        }
        console.log(rows);
        res=rows;
        ctx.body=res;
        return ctx;
    });
    return co;
};

_rotr.apis.deleteorder=function(){//删除订单
    var res={};
    var ctx=this;
    var co=$co(function*(){
        var OrderId= ctx.query.orderId || ctx.request.body.orderId;
        var dat={};
        var sqlstr="delete from orderinfo where OrderId='"+OrderId+"'";
        var row=yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!row)throw Error("失败");
        var sqlstr1="delete from mydb.`order` where OrderId='"+OrderId+"'";
        var rows=yield _ctnu([_mysql.conn,'query'],sqlstr1);
        if(!rows)throw Error("失败");
        else{
            var regResult=1;
        }
        res=regResult;
        ctx.body=res;
        return ctx;
    });
    return co;
};

_rotr.apis.buy=function(){//购买订单
    var res={};
    var ctx=this;
    var co=$co(function*(){
        var OrderId= ctx.query.orderId || ctx.request.body.orderId;
        var dat={};
        var sqlstr2="update video set Purchase=Purchase+1 where VideoId in (select VideoId from orderinfo where OrderId='"+OrderId+"')";
        var rows=yield _ctnu([_mysql.conn,'query'],sqlstr2);
        if(!rows)throw Error("失败");
        var sqlstr1="update mydb.`order` set OrderType='是' where OrderId='"+OrderId+"'";
        var rows=yield _ctnu([_mysql.conn,'query'],sqlstr1);
        if(!rows)throw Error("失败");
        else{
            var regResult=1;
        }
        res=regResult;
        ctx.body=res;
        return ctx;
    });
    return co;
};

_rotr.apis.keep = function(){//收藏
    var ctx = this;
    var co = $co(function * () {
        var userId = ctx.query.userId || ctx.request.body.userId;
        var videoId=ctx.query.videoId || ctx.request.body.videoId;
        var time=ctx.query.time || ctx.request.body.time;
        var dat={};
        var sqlstr="insert into keep (VideoId,UserId,KeepTime) values ('"+videoId+"','"+userId+"','"+time+"')";
        var rows = yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!rows)throw Error("失败");
        else{
            result=1;
        }
        dat=result;
        ctx.body = dat;
        return ctx;
    });
    return co;
};

_rotr.apis.keepselect = function(){//收藏准备
    var ctx = this;
    var co = $co(function * () {
        var userId = ctx.query.userId || ctx.request.body.userId;
        var videoId=ctx.query.videoId || ctx.request.body.videoId;
        var time=ctx.query.time || ctx.request.body.time;
        var dat={};
        var sqlstr2="select * from keep where VideoId='"+videoId+"' and UserId='"+userId+"'";
        var rows = yield _ctnu([_mysql.conn,'query'],sqlstr2);
        if(!rows)throw Error("失败");
        dat=rows;
        ctx.body = dat;
        return ctx;
    });
    return co;
};

_rotr.apis.selectkeep = function(){//收藏查询
    var ctx = this;
    var co = $co(function * () {
        var userId = ctx.query.id || ctx.request.body.id;
        var dat={};
        var sqlstr="select keep.VideoId as VideoId,keep.UserId as UserId,VideoName,VideoPrice,ImgPath,KeepTime " +
            "from keep,video where keep.VideoId=video.VideoId and keep.UserId='"+userId+"'";
        var rows = yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!rows)throw Error("失败");
        dat = rows;
        console.log(dat);
        ctx.body = dat;
        return ctx;
    });
    return co;
};

_rotr.apis.deletekeep = function(){//收藏删除
    var ctx = this;
    var co = $co(function * () {
        var videoId = ctx.query.id || ctx.request.body.id;
        var userId= ctx.query.userId || ctx.request.body.userId;
        var dat={};
        console.log(videoId,userId);
        var sqletr="delete from keep where VideoId='"+videoId+"' and UserId='"+userId+"'";
        var rows = yield _ctnu([_mysql.conn,'query'],sqletr);
        if(!rows)throw Error("失败");
        else{
            var result=1;
        }
        dat=result;
        ctx.body = dat;
        return ctx;
    });
    return co;
};

_rotr.apis.selectbuy = function(){//购买的视频
    var ctx = this;
    var co = $co(function * () {
        var userId= ctx.query.userId || ctx.request.body.userId;
        var dat={};
        console.log(userId);
        var sqletr="select video.VideoId,VideoName,ImgPath,OrderTime from video,(select orderinfo.VideoId,OrderTime from orderinfo,mydb.`order` where mydb.`order`.UserId='"+userId+"' and OrderType='是' and orderinfo.OrderId=mydb.`order`.OrderId) c where video.VideoId=c.VideoId" ;        var rows = yield _ctnu([_mysql.conn,'query'],sqletr);
        if(!rows)throw Error("失败");

        dat=rows;
        ctx.body = dat;
        return ctx;
    });
    return co;
};

_rotr.apis.sousuo = function(){//搜索视频
    var ctx = this;
    var co = $co(function * () {
        var className= ctx.query.name || ctx.request.body.name;
        var dat={};
        var sqletr="select * from video where VideoclassId in (select VideoclassId from videoclass where VideoclassName like '"+"%"+className+"%"+"')" ;
        var rows = yield _ctnu([_mysql.conn,'query'],sqletr);
        if(!rows)throw Error("失败");
        dat=rows;
        console.log(dat);
        ctx.body = dat;
        return ctx;
    });
    return co;
};

//视频简介接口
_rotr.apis.videoMessage = function(){
    var ctx =this;
    var videoId = ctx.query.videoId || ctx.request.body.videoId;
    var co = $co(function*(){
        //// 通过ID对数据库进行二次多表查询指定属性
        console.log(videoId+'视频ID');
        //数据库查询语句有更改
        var sqlstr1="select VideoName,VideoSyno from video where VideoId='"+videoId+"'";
        //var sqlstr1="select VideoSyno,Content from video v,assess a where a.VideoId=v.VideoId and a.VideoId='"+aaa+"'";
        var rows1=yield _ctnu([_mysql.conn,'query'],sqlstr1);
        if(!rows1)throw Error("失败");

        console.log("rows1",rows1);
        //console.log('>>>>>ImgPath',ImgPath);
        ctx.body = rows1;
        return ctx;
    });
    return co;
};
//视频评价接口的代码，，
_rotr.apis.videosyno = function(){
    var ctx =this;
    var videoId = ctx.query.videoId || ctx.request.body.videoId;
    var co = $co(function*(){
        var sqlstr="select UserName,ImgPath,Content from assess a left join user u on a.UserId=u.UserId where VideoId='"+videoId+"'";
        //var sqlstr1="select VideoSyno,Content from video v,assess a where a.VideoId=v.VideoId and a.VideoId='"+aaa+"'";
        var rows1=yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!rows1)throw Error("失败");

        console.log("rows1",rows1);
        //console.log('>>>>>ImgPath',ImgPath);
        ctx.body = rows1;
        return ctx;
    });
    return co;
};



_rotr.apis.videoPlayJudge = function(){
    var ctx =this;
    var videoId = ctx.query.videoId || ctx.request.body.videoId;
    var UserId = ctx.query.id || ctx.request.body.id;
    var co = $co(function*() {
        var dat = {};
        var sqlstr = "select distinct VideoPrice from video v left join assess a on a.VideoId=v.VideoId where v.VideoId='" + videoId + "'";
        var rows = yield _ctnu([_mysql.conn, 'query'], sqlstr);
        if (rows[0]['VideoPrice'] != 0) {
            //var sqlstr1 = "select VideoId from mydb.orderinfo where (select OrderType from `order` where UserId = '" + UserId + "') = '是'";
            var sqlstr1 = "select OrderType from mydb.`order` where OrderId in (select OrderId from orderinfo where VideoId = '"+videoId+"' and UserId = '"+UserId+"')";
            var rows1 = yield _ctnu([_mysql.conn, 'query'], sqlstr1);
            console.log('2334', rows1);
            if (rows1['OrderType'] == '是' || rows1 != ''){
                var sqlstr2 = "select VideoPath from video v left join assess a on a.VideoId=v.VideoId where v.VideoId='" + videoId + "'";
                var rows0 = yield _ctnu([_mysql.conn, 'query'], sqlstr2);
                console.log('2336', rows0);
                dat = {data:rows0,status:'true'};
            }else {
                var sqlstr3 = "select VideoPath from video v left join assess a on a.VideoId=v.VideoId where v.VideoId='" + videoId + "'";
                var rows3 = yield _ctnu([_mysql.conn, 'query'], sqlstr3);
                dat = {data:rows3,status:'false'};
            }
        }
        else {
            var sqlstr4 = "select distinct VideoPath from video v left join assess a on a.VideoId=v.VideoId where v.VideoId='" + videoId + "'";
            var rows = yield _ctnu([_mysql.conn, 'query'], sqlstr4);
            console.log('2337', rows);
            dat = {data: rows, status: 'true'};
        }
        ctx.body = dat;
        return ctx;
    });
    return co;
};


//视频浏览量
_rotr.apis.videoVisit = function(){
    var ctx =this;
    var videoId = ctx.query.videoId || ctx.request.body.videoId;
    var co = $co(function*(){
        var sqlstr=" update video set OverPeople=OverPeople+1 where VideoId='"+videoId+"'";
        var rows=yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!rows)throw Error("失败");
        console.log("rows",rows);
        ctx.body = rows;
        return ctx;
    })
    return co
};

//加入收藏
_rotr.apis.addmystudy = function(){
    var ctx =this;
    var videoId = ctx.query.videoId || ctx.request.body.videoId;
    var UserId = ctx.query.id || ctx.request.body.id;
    var KeepTime = ctx.query.time || ctx.request.body.time;
    var co = $co(function*(){
        var sqlstr1=" INSERT INTO keep (KeepTime,VideoId,UserId) VALUES ('"+KeepTime+"','"+videoId+"','"+UserId+"')";
        var rows=yield _ctnu([_mysql.conn,'query'],sqlstr1);

        if(!rows)throw Error("失败");
        console.log("rows1",rows);
        //console.log('>>>>>ImgPath',ImgPath);
        ctx.body = rows;
        return ctx;
    });
    return co;
};



//撰写评论
_rotr.apis.comment = function(){
    var ctx =this;
    var Content = ctx.query.Content || ctx.request.body.Content;
    var AssessTime = ctx.query.AssessTime || ctx.request.body.AssessTime;
    var VideoId = ctx.query.videoId || ctx.request.body.videoId;
    var UserId = ctx.query.id || ctx.request.body.id;
    console.log(Content,AssessTime,VideoId,UserId);
    var co = $co(function*(){
        var sqlstr1="INSERT INTO assess (Content,AssessTime,VideoId,UserId) VALUES ('"+Content+"','"+AssessTime+"','"+VideoId+"','"+UserId+"');";
        var rows=yield _ctnu([_mysql.conn,'query'],sqlstr1);

        if(!rows)throw Error("失败");
        console.log("rows",rows);
        ctx.body = rows;
        return ctx;
    });
    return co;
};
//账号页的头像,昵称接口,
_rotr.apis.UserType = function(){
    var ctx = this;
    var userId = ctx.query.id || ctx.request.body.id;
    //var imgPath = ctx.query.imgPath || ctx.request.body.imgPath;
    var co = $co(function*(){
        console.log('头像处：',userId);
        //var dat = {};
        var sqlstr="select ImgPath,UserNick,UserType,UserName from mydb.user where UserId='"+userId+"'";
        var rows = yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!rows)throw Error("失败");
        console.log("头像",rows);
        //console.log('>>>>>ImgPath',ImgPath);
        ctx.body = rows;
        return ctx;
    });
    return co;
};

//上传头像

_rotr.apis.uploadPhoto = function(){
    var ctx = this;
    var userId = ctx.query.id || ctx.request.body.id;
    var imgPath = ctx.query.imgPath || ctx.request.body.imgPath;
    var co = $co(function*(){
        console.log('头像处：',userId);
        var sqlstr="update user set ImgPath='"+imgPath+"'where UserId='"+userId+"'";
        console.log("sqlstr",sqlstr);
        var rows = yield _ctnu([_mysql.conn,'query'],sqlstr);
        if(!rows)throw Error("失败");
        console.log("头像",rows);
        //console.log('>>>>>ImgPath',ImgPath);
        ctx.body = rows;
        return ctx;
    });
    return co;
};



//账号详情接口，，借用，
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
        }else {
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
