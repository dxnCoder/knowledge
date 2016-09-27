/**
 * Created by liu on 2016/9/14.
 */

//直接对项目工厂的接口地址的引用
//$('#tp_yz').click(function(){
//    var dat = {
//        phone: $('.username').val(),
//    };
//    $.post('/start/api/getPhoneRegCode',dat,function(dat){
//    })
//})
//$('#submit').click(function(){
//    var dat = {
//        phone: $('.username').val(),
//        phoneCode:$('#yzm').val(),
//        pw:hex_md5($('#pwd').val())
//    }
//    $.post('/start/api/regByPhone',dat,function(){
//        if(res==1){
//            alert("您已经注册成功");
//            window.location.href='index.html'
//        }
//    })
//});

//自己接口的引用

$('#tp_yz').click(function(){
    var dat = {
        phone: $('.username').val(),
    };
    $.post('/start/api/getPhoneRegCode',dat,function(dat){
    })
})

$('.password').click(function(){
    var dat = {
        phone: $('.username').val(),
    };
    $.get('/api/regSel',dat,function(res){
        if(res>=1){
            $('div:hidden').show()
        }
        else{
            $('#nameSel').hide()
        }
    })
});

$('#submit').click(function () {
    console.log('regbtn click');
    var dat = {
        phone: $('.username').val(),
        pw: $('.password').val()
    };
    $.post('/api/reg',dat,function(res){
        if(res==1){
            alert("您已经注册成功");
            window.location.href='../index.html'
        }
    })
});