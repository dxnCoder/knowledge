/**
 * Created by liu on 2016/9/19.
 */
$.post('../api/use',function(dat){
    for(var i=0;i<dat.length;i++){
        var usr=dat[i];
        var usrjo=$('#courtype').clone(true,true);
        usrjo.find('#Id').html(usr['UserId']);
        usrjo.find('#Name').html(usr['UserName']);
        usrjo.find('#Type').html(usr['UserType']);
        usrjo.find('#btn').html("<div class='btn btn-default' onclick=\'del("+usr['UserId']+")\'>"+"删除"+"</div>");
        //usrjo.find('#btn').attr('id','btn'+i);
        $('#trbox').append(usrjo);
    }
});
function del(usr) {
    var tname;
    if (!e) {
        var e = window.event;
    }
    //获取事件点击元素
    var targ = e.target;
    //获取元素名称
    var cente = targ.parentNode.parentNode.parentNode;
    var id = usr;
    var dat = {name: id};
    $.post('../api/selectusr', dat, function (res) {
        if (res != 0) {
            alert('该用户已上传视频，不能删除！');
        }
        else {
            if (!confirm("确认要删除？")) {
                var kay = window.event.returnValue = false;
            }
            if (kay != false) {
                var id = usr;
                var dat = {name: id};

                $.post('../api/deleteusr', dat, function (res) {
                    if (res == 1) {
                        alert('删除成功！');
                        cente.remove();
                    }
                    else {
                        alert("删除失败！");
                    }
                })
            }
        }
    })

}


