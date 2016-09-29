/**
 * Created by liu on 2016/9/19.
 */
    $.post('/api/use',function(dat){
        for(var i=0;i<dat.length;i++){
            var usr=dat[i];
            var usrjo=$('#courtype').clone(true,true);
            usrjo.find('#Id').html(usr['UserId']);
            usrjo.find('#Name').html(usr['UserName']);
            usrjo.find('#Type').html(usr['UserType']);
            usrjo.find('#btn').html("<a href='../user.html'><div class='btn btn-default' onclick=\'del("+usr['UserId']+")\'>"+"删除"+"</div></a>");
            //usrjo.find('#btn').attr('id','btn'+i);
            $('#trbox').append(usrjo);
        }
    });


