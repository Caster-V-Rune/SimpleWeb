$(document).ready(function () {
    $('.enable-modify-s').on('click', function(){
        var flag = $(this).attr('static');
        if (flag != 'static') {
            var content = $(this).html();
            $(this).html('<input type="text" class="enable-modify-d">');
            $('.enable-modify-d').val(content);
            $(this).attr('static','static');
            $('.enable-modify-d').focus();
        }
    });

    $('.enable-modify-s').on('blur', '.enable-modify-d', function () {
        var father = $(this).parent();
        var flag = father.attr('static');
        if (flag == 'static') {
            var content = $(this).val();
            var table = father.attr('v1');
            var id = father.attr('v2');
            var name = father.attr('v4');
            var id_name = father.attr('v3');
            if (content){
            $.ajax({
                method: 'post',
                url: "/admin/modify/",
                data:{
                    table: table,
                    id: id,
                    id_name: id_name,
                    name: name,
                    value: content
                },
                success: function(){
                    father.html(content);
                    father.attr('static','null');
                },
                error: function(){
                    alert('error');
                }

            });
            }
        }
    });



});