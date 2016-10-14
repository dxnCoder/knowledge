/**
 * Created by liu on 2016/9/19.
 */
$(document).ready(function(){
        var videopath=$('#wenjian').val();
        var imgpath=$('#wenjian2').val();
        if(videopath==null){
            $('.path').hide();
        }else{$('.path').show();}
        if(imgpath==null){
            $('.path1').hide();
        }else{$('.path1').show();}
    $.post('../api/courseType',function(dat) {
        var ta = new Array();
        for (var i = 0; i < dat.length; i++) {
            var type = dat[i]['ClassName'];
            ta.push(type);
        }
        var clas=ta;
        for(var j=0;j<clas.length;j++){
            $('#opbox').append("<option>"+clas[j]+"</option>");
        }
    });
    $('#opbox').click(function () {
        var dat = {
            name: $('.opt').val()
        };

        $.post('../api/Type', dat, function (dat) {
            $("#type").empty();
            for (var i = 0; i < dat.length; i++) {
                $('#type').append("<option>" + dat[i]['VideoclassName']+ "</option>");
            }
        })
    });
});
function Submit(){
    console.log(localStorage.vvv);
    var videoname=$('#type').val();
    var name=$('#name').val();
    var videopath=$('#wenjian').html();
    var imgpath=$('#wenjian2').html();
    var price=$('#price').val();
    var syno=$('#syno').val();
    if(videoname==null){
        alert('类型不能为空！')
    }
    else{
        if(videopath==null){
            alert('视频不能为空！')
        }
        else{
            if(imgpath==null){
                alert('图片不能为空！')
            }
            else{
                if(name==''){
                    alert('视频名称不能为空！')
                }else {
                    var dat={VideoclassName:videoname};
                    $.post('../api/videoSelect',dat,function(res){
                        var videoId=res[0]['VideoclassId'];
                        var time=CurentTime();
                        var userId=localStorage.vvv;
                        var dir={
                            VideoName:name,
                            VideoSyno:syno,
                            VideoPrice:price,
                            time:time,
                            VideoclassId:videoId,
                            VideoPath:videopath,
                            ImgPath:imgpath,
                            UserId:userId
                        };
						console.log(videoname+videopath+imgpath+price+syno+time);
                        $.post('../api/upload',dir,function(mn){
                            if(mn==1){
                                alert('上传成功！');location.reload();
                            }else{
                                alert('上传失败！');
                            }
                        })
                    })
                }
            }
        }
    }
}
function CurentTime()
{
    var now = new Date();

    var year = now.getFullYear();       //年
    var month = now.getMonth() + 1;     //月
    var day = now.getDate();            //日

    var hh = now.getHours();            //时
    var mm = now.getMinutes();          //分

    var clock = year + "-";

    if(month < 10)
        clock += "0";

    clock += month + "-";

    if(day < 10)
        clock += "0";

    clock += day + " ";

    if(hh < 10)
        clock += "0";

    clock += hh + ":";
    if (mm < 10) clock += '0';
    clock += mm;
    return(clock);
}