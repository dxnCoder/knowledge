/**
 * Created by dell on 2016/9/27.
 */
//该方法的不足，会对三个接口传来的所有数据进行查询，并需要三个静态界面接收。。给服务器增加负担。需改进
$.post('/api/more',function(dat){
    console.log(dat)
    for(var i=0;i<dat.length;i++){
        var usr=dat[i];
        console.log(usr['Imgpath']);
        var usrjo = $('#lesson').clone(true,true);
        usrjo.find('#lesson_image').attr('src',usr['Imgpath']);
        usrjo.find('#lesson_name').html(usr['VideoName']);
        $('#lesson_head').append(usrjo);
    }
});

$(document).ready(function() {

    $.post('/api/more1',function(dat){
        //console.log("0001",dat[0]);

        for(var i=0;i<dat.length;i++){
            var usr=dat[i];
            //console.log("0002",usr['ImgPath']);
            var usrjo = $('#lesson1').clone(true,true);
            //console.log("knkn"+usr['ImgPath']);
            usrjo.find('#lesson_image1').attr('src',usr['ImgPath']);
            usrjo.find('#lesson_name1').html(usr['VideoName']);
            $('#lesson_head1').append(usrjo);
        }
    });
})

$(document).ready(function() {

    $.post('/api/more2',function(dat){
        console.log(dat[0]);
        for(var i=0;i<dat.length;i++){
            var usr=dat[i];
            console.log(usr['ImgPath']);
            var usrjo = $('#lesson2').clone(true,true);
            //console.log("knkn"+usr['ImgPath']);
            usrjo.find('#lesson_image2').attr('src',usr['ImgPath']);
            usrjo.find('#lesson_name2').html(usr['VideoName']);
            $('#lesson_head2').append(usrjo);
        }
    });
})
