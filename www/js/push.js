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
    _fns.uploadFile('test-A',$('#shangchuan'),function(f){
        console.log('>>>>before2:',f);
    },function(f){
        console.log('>>>>progress2:',f);
        $('#wancheng').css('width', f.percent + '%');
        $('#wancheng').html(f.percent + '%');
    },function(f){
        console.log('>>>>success2:',f);
        $('#wenjian').html(f.url);
        $('#wenjian').attr('href', f.url)
    });
});
console.log('>>>>FFF');