/**
 * Created by liu on 2016/9/14.
 */
/*每个模块都应该引入的js脚本,需要jquery和bootstrap支持
 自动创建顶部和底部元件*/


$('#submit').click(function(){
    var dat={
        phone:$('.username').val(),
        pw:$('.password').val()
    };


$.post('/api/login',dat, function (res){
    if(res > 0){
        alert('登录成功，您的编号是：'+res);
        window.location.href='../首页.html';
    }else{
       alert("登录失败")
    }
  })
})


    //
    //
    //$('#regbtn').click(function () {
    //    console.log('regbtn click');
    //    var dat = {
    //        name: $('#regname').val(),
    //        pw: $.md5($('#regpw').val()) //项目中需要添加jquery.md5.js文件
    //    };
    //    alert(dat.name + "\r\n" + dat.pw);
    //    var path = 'http://m.xmgc360.com/start/api/loginByPhone?phone=' + dat.name + '&pw=' + dat.pw;
    //    $.ajax({
    //        type : "get",
    //        url: path,
    //        dataType : "jsonp",//数据类型为jsonp
    //        success : function(data){
    //            console.log('>>>>>>REG', data);
    //        },
    //        error:function(){
    //            console.log('err');
    //        }
    //    });

        //$.post('/api/reg', dat, function (res) {
        //    console.log('>>>>>>REG', res);
        //    alert('reg ok!');
        //});
    //});

$('#zhuce').click(function(){
    window.location.href='../zhuce.html'
});
