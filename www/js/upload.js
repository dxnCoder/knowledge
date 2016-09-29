/**
 * Created by liu on 2016/9/19.
 */
$(document).ready(function(){
    $.post('/api/courseType',function(dat) {
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

        $.post('/api/Type', dat, function (dat) {
            $("#type").empty();
            for (var i = 0; i < dat.length; i++) {
                $('#type').append("<option>" + dat[i]['VideoclassName']+ "</option>");
            }
        })
    });
});
