/**
 * Created by dell on 2016/9/22.
 */

$('#shangchuan').click(function(){
   _fns.uploadFile2($('#shangchuan'),function(f){
       console.log('>>>>>>>>>>>before:',f);
   },function(f){
       console.log('>>>>>>progressAAAA:',f);
       $('#wancheng').css('width', f.percent+'%');
       $('#wancheng').html(f.percent+'%');
       console.log('>>>>>AAAA');
   },function(f){
       console.log('>>>>successXXXX:',f);
       $('#wenjian').html(f.url);
       $('#wenjian').attr('href', f.url);
   });
});



$('#shangchuan2').click(function(){
    _fns.uploadFile('test-A',$('#shangchuan2'),function(f){
        console.log('>>>>before2:',f);
    },function(f){
        console.log('>>>>progress2:',f);
        $('#wancheng2').css('width', f.percent + '%');
        $('#wancheng2').html(f.percent + '%');
    },function(f){
        console.log('>>>>success2:',f);
        $('#wenjian2').html(f.url);
        $('#wenjian2').attr('href', f.url)
    });
});




$('#img').click(function(){
    _fns.uploadFile('test-A',$('#img'),function(f){
        console.log('>>>>before3:',f);
    },function(f){
        console.log('>>>>progress3:',f);
        $('#wancheng3').css('width', f.percent + '%');
        $('#wancheng3').html(f.percent + '%');
    },function(f){

        $('#wenjian3').html(f.url);
        console.log('>>>>success3:',$('#wenjian3').html());
        $('#wenjian3').attr('href', f.url);
        if($('#wenjian3').html!=''){
            insert();
        }
    });
});
function insert(){
    var dir = {
        imgPath:$('#wenjian3').html(),
        id:localStorage.vvv,
    }
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaa",dir)
    $.post('../api/uploadPhoto',dir,function(res){
        console.log('》》》》》',dir);
        location.reload();
    })
}




console.log('>>>>FFF');