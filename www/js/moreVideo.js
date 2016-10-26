/**
 * Created by dell on 2016/9/27.
 */
$.post('../api/more',function(dat){
    console.log(dat);
    for(var i=0;i<dat.length;i++){
        var usr=dat[i];
        console.log(usr['Imgpath']);
        console.log(usr['VideoId']);
        console.log(usr['OverPeople']);
        var usrjo = $('#lesson').clone(true,true);
        usrjo.find('#lesson_image').attr('src',usr['Imgpath']);
        usrjo.find('#people').html(usr['OverPeople']);
        usrjo.find('#lesson_name').html(usr['VideoName']);
        usrjo.find('#video_id').html(usr['VideoId']);
        $('#lesson_head').append(usrjo);
    }
});

function tiaozhuan(e){
    var tname;
    if(!e){
        var e = window.event;
    }
    //获取事件点击元素
    var targ = e.target;
    //console.log("图片",targ);
    //获取元素名称
    //tname=targ.parentNode.parentNode.childNodes[7].innerHTML;
    tname = targ.parentElement.parentElement.firstElementChild.innerHTML;
    console.log("图片",tname);
    localStorage.imgSrc=tname;
    console.log("localStorage",localStorage.imgSrc);
   window.location.href='videoMessage.html'
}

$(document).ready(function() {

    $.post('../api/more1',function(dat){
        //console.log("0001",dat[0]);

        for(var i=0;i<dat.length;i++){
            var usr=dat[i];
            if(usr['VideoPrice']==0){
                usr['VideoPrice']='免费';
                $('#videoPrice1').css('color','green');
            }else {
                usr['VideoPrice']="￥ "+usr['VideoPrice'];
                $('#videoPrice1').css('color','red');
            }
            //console.log("0002",usr['ImgPath']);
            var usrjo = $('#lesson1').clone(true,true);
            //console.log("knkn"+usr['ImgPath']);
            usrjo.find('#lesson_image1').attr('src',usr['ImgPath']);
            usrjo.find('#people1').html(usr['OverPeople']);
            usrjo.find('#lesson_name1').html(usr['VideoName']);
            usrjo.find('#videoPrice1').html(usr['VideoPrice']);
            usrjo.find('#video_id1').html(usr['VideoId']);
            $('#lesson_head1').append(usrjo);
        }
    });
    $.post('../api/more2',function(dat){
        console.log(dat[0]);
        for(var i=0;i<dat.length;i++){
            var usr=dat[i];
            if(usr['VideoPrice']==0){
                usr['VideoPrice']='免费';
                $('#videoPrice2').css('color','green');
            }else {
                usr['VideoPrice']="￥ "+usr['VideoPrice'];
                $('#videoPrice2').css('color','red');
            }
            console.log(usr['ImgPath']);
            var usrjo = $('#lesson2').clone(true,true);
            //console.log("knkn"+usr['ImgPath']);
            usrjo.find('#lesson_image2').attr('src',usr['ImgPath']);
            usrjo.find('#people2').html(usr['OverPeople']);
            usrjo.find('#lesson_name2').html(usr['VideoName']);
            usrjo.find('#videoPrice2').html(usr['VideoPrice']);
            usrjo.find('#video_id2').html(usr['VideoId']);
            $('#lesson_head2').append(usrjo);
        }
    });
});
