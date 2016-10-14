/**
 * Created by liu on 2016/9/18.
 */
$.post('../api/video', function(dat) {
    //$("#Id").html(dat[0]['ClassId']);
    //$("#name").html(dat[0]['ClassName']);
    for(var i=0;i<dat.length;i++){
        var usr=dat[i];
        var usrjo=$('#courtype').clone(true,true);
        usrjo.find('#Id').html(usr['VideoId']);
        usrjo.find('#name').html(usr['VideoName']);
        usrjo.find('#Courname').html(usr['VideoclassName']);
        usrjo.find('#user').html(usr['UserName']);
        usrjo.find('#jianjie').html(usr['VideoSyno']);
        usrjo.find('#jiage').html(usr['VideoPrice']);
        usrjo.find('#time').html(usr['time']);
        usrjo.find('#shangjia').html(usr['VideoGround']);
        usrjo.find('#lujing').html(usr['VideoPath']);
        usrjo.find('#lujing').attr('href',usr['VideoPath']);
        usrjo.find('#img').html(usr['ImgPath']);
        usrjo.find('#img').attr('href',usr['ImgPath']);
        usrjo.find('#btn').html("<div class='btn btn-default' onclick=\"edit("+i+")\">"+'编辑'+"</div>"
            +"&nbsp;<div class='btn btn-default' onclick=\'del("+usr['VideoId']+")\'>"+'删除'+"</div>");
        $('#trbox').append(usrjo);
    }
});
function edit(rowId){
    var table=document.getElementById('trbox');
    var row=table.rows[rowId+1];
    row.cells[5].firstChild.innerHTML = "<input type='text' style='width: 100%;' value='" + row.cells[5].firstChild.innerHTML + "'>";
    row.cells[7].firstChild.innerHTML="<select><option>是</option><option>否</option></select>";
    row.cells[9].firstChild.innerHTML = "<div class='btn btn-default' id='sub'>"+"确定"+"</div>";
    $('#sub').click(function(){
        var jiage=row.cells[5].firstChild.firstChild.value;
        var shangjia=row.cells[7].firstChild.firstChild.value;
        var id=row.cells[0].firstChild.innerHTML;
        var dat={
            id:id,
            price:jiage,
            grounding:shangjia
        };
        $.post('../api/videoUpdate',dat,function(res){
            if(res==1){
                alert('编辑成功！');
            }
            else{
                alert("编辑失败！");
            }
            location.reload();
        })
    })
}
function del(usr){
    if (!confirm("确认要删除？")) {
        var kay=window.event.returnValue = false;
    }
    if(kay!=false) {
        var id = usr;
        var dat = {name: id};
        $.post('../api/deletvideo', dat, function (res) {
            location.reload();
        })
    }
}