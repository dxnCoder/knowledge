/**
 * Created by liu on 2016/9/18.
 */
    $.post('/api/videoType',function(dat){
        //$("#Id").html(dat[0]['ClassId']);
        //$("#name").html(dat[0]['ClassName']);
        for(var i=0;i<dat.length;i++){
            var usr=dat[i];
            var usrjo=$('#courtype').clone(true,true);
            usrjo.find('#Id').html(usr['VideoclassId']);
            usrjo.find('#name').html(usr['VideoclassName']);
            usrjo.find('#Courname').html(usr['ClassName']);
            usrjo.find('#btn').html("<div class='btn btn-default' onclick=\"del('"+usr['VideoclassId']+"')\">"+'删除'+"</div>");
            $('#trbox').append(usrjo);
        }
    });
$("#add").click(function(){
    $("#table").append('<tr>'+
        '<td>'+
        '<input name="" type="text" id="t1"/>'+
        '</td>'+
        '<td>'+
        '<input name="" type="text" id="t2"/></td><td style="width: 30%"><select id="t3" class="form-control"></select>'+
        '</td>'+
        '<td style="width: 10%">'+
        '<div class="btn btn-default" onclick="aaa()" id="del">确定</div></td>');
    $.post('/api/courseType', function (dat) {
        for (var i = 0; i < dat.length; i++) {
            $('#t3').append("<option>" + dat[i]['ClassName']+ "</option>");
        }
    });
});
function aaa(){
    var tab = document.getElementById("table") ;
    //表格行数
    //var rows = tab.rows.length ;
    //表格列数
    //var cells = tab.rows.item(0).cells.length ;
    var row1=tab.rows[0].cells[0].firstChild.value;
    var row2=tab.rows[0].cells[1].firstChild.value;
    var row3=tab.rows[0].cells[2].firstChild.value;
    //alert(row1.firstChild.value+row2.firstChild.value+row3.firstChild.value);
    if(row1==''||row2==''||row3==''){
        alert('不能为空！')
    }
    else{
        var dat={id:row1,name:row2,type:row3};
        $.post('/api/typeAdd',dat,function(res){
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
/*
$("#del").click(function(){
    alert('q12213231');
   var t1=$('#t1').val;
    var t2=$('#t2').val;
    var t3=$('#t3').val;
    if(t1==''||t2==''||t3==''){
        alert("不能为空！");
    }
    else {
        alert(t1);
    }
});*/
//function aaa() {
//    var t1 = $('#table')[0].firstChild.val;
//    alert("LL" + t1);
//    var t2 = $('#t2').val;
//    var t3 = $('#t3').val;
//    if (t1 == '' || t2 == '' || t3 == '') {
//        alert("不能为空！");
//    }
//}