/**
 * Created by dell on 2016/10/8.
 */

$('#submit').click(function(){
    var dat={
        phone:$('.username').val(),
        pw:$('.password').val()
    };

    $.post('../api/login',dat,function(res){
        if(res > 0){
            alert('登录成功，您的编号是：'+res);
            window.location.href='首页.html';
        }else{
            alert("登录失败")
        }
    })
});

$('#zhuce').click(function(){
    window.location.href='zhuce.html'
});
