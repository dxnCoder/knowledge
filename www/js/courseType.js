/**
 * Created by liu on 2016/9/18.
 */
$(document).ready(function(){
    $.post('../api/courseType',function(dat){
        //$("#Id").html(dat[0]['ClassId']);
        //$("#name").html(dat[0]['ClassName']);
        for(var i=0;i<dat.length;i++){
            var usr=dat[i];
            var usrjo=$('#courtype').clone(true,true);
            usrjo.find('#Id').html(usr['ClassId']);
            usrjo.find('#name').html(usr['ClassName']);
            $('#trbox').append(usrjo);
        }
    });
});
$("#add").click(function(){
    $("#table").append('<tr>'+
        '<td>'+
        '<input name="" type="text" id="t1"/>'+
        '</td>'+
        '<td>'+
        '<input name="" type="text" id="t2"/></td>'+
        '<td style="width: 10%">'+
        '<div class="btn btn-default" onclick="aaa()" id="del">确定</div></td>');
});
function aaa(){
    var tab = document.getElementById("table") ;
    //表格行数
    //var rows = tab.rows.length ;
    //表格列数
    //var cells = tab.rows.item(0).cells.length ;
    var row1=tab.rows[0].cells[0].firstChild.value;
    var row2=tab.rows[0].cells[1].firstChild.value;
    //alert(row1.firstChild.value+row2.firstChild.value+row3.firstChild.value);
    if(row1==''||row2==''){
        alert('不能为空！')
    }
    else{
        var dat={id:row1,name:row2};
        $.post('../api/courseTypeadd',dat,function(res){
            if(res==1){
                alert('成功增加！')
            }
            else {
                alert('失败');
            }
            location.reload();
        })
    }
}
