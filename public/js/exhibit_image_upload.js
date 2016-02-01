
// stackoverflow.com/questions/8903854/check-image-width-and-height-on-upload-with-javascript
// stackoverflow.com/questions/3914483/how-to-define-a-new-global-function-in-javascript
var imageUpload;
var n = 0;
(function () {
    
function getSetting(settings, name) {
    
    function getSetting_(val) {
        if (typeof val === 'function') {
            return getSetting_(val());
        } else { return val; }
    }
    
    return getSetting_(settings[name]);
}

function validateImage (imageFile, width, height, callback) {
    width = parseInt(width || 0), height = parseInt(height || 0);
    function errorCallback (e) {
        callback(new Error('无效图像')); }

    var reader = new FileReader();
    reader.addEventListener('error', errorCallback);
    reader.addEventListener('load', function (e) {
        var element = document.createElement('img');
        element.addEventListener('error', errorCallback);
        element.addEventListener('load', function (e) {
            if ((width === 0 || width === element.width) &&
                (height === 0 || height === element.height)) {
                callback(null);
            } else {
                var dimensionStr = width.toString() + ' x ' + height.toString();
                callback(new Error('图像大小不符合要求，需要 ' + dimensionStr + ' 的图像'));
            }
        });
        element.src = e.target.result;
    });
    reader.readAsDataURL(imageFile);
}

function updateDBRecord (filename, settings, callback) {
    var xhr_update = new XMLHttpRequest();
    xhr_update.responseType = 'json';
    xhr_update.open('POST', '/admin/exhibit/savePost', true);
    xhr_update.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    xhr_update.addEventListener('load', function (e) {
        if (e.target.status === 200) {
            callback(null);
        } else {
            callback(xhr_update.response);
        }
    });
    xhr_update.send(JSON.stringify({
        'image': '/images/user/' + filename,
        'primary_id': getSetting(settings, 'primary_id'),
        'second_id': getSetting(settings, 'second_id'),
        'slides_id': getSetting(settings, 'slides_id'),
    }));
}

imageUpload = function (settings) {
    var modal = document.getElementById('modal-upload-image');
    function onModalSubmit (e) {

        var file = modal.getElementsByTagName('input')[0].files[0];
        // TODO: check file.type
        if (!/image.*/.test(file.type)) {
            alert('请选择一个图片文件！');
            return;
        }
        
        var width = 0, height = 0;
        if (getSetting(settings, 'sizeLimited')) {
            width = getSetting(settings, 'width') || 0;
            height = getSetting(settings, 'height') || 0;
        }
        validateImage(file, width, height, function (err) {
            if (err) { alert(err); return; }
            var formData = new FormData();
            formData.append('image', file, file.name);
            console.log('n='+n);
            if (n>5) {
                alert('最多添加6张图片!');
                return false;
            }
            var xhr_upload = new XMLHttpRequest();
            xhr_upload.responseType = 'json';
            xhr_upload.open('POST', '/admin/upload/image', true);
            xhr_upload.addEventListener('load', function (e) {
                if (e.target.status === 201) {
                    var old = $('#exhibits-img').html();
                    $('#exhibits-img').html(old+'<div class="imgs"><a href="/images/user/'+e.target.response['filename']+'">图片</a>' +
                        '<a onclick="delImg(this,\''+e.target.response['filename']+'\')"><span class="glyphicon glyphicon-remove" aria-hidden="false"></span></a></div>');
                    alert('上传成功！');
                    n++;
                    $(modal).modal('hide');
                    console.log(e.target.response['filename']);
                    //updateDBRecord(e.target.response['filename'], settings,
                    //    function (err) {
                    //        if (err) {
                    //            alert('数据更新过程中出现未知错误！');
                    //            return;
                    //        }
                    //        alert('上传成功！');
                    //        $(modal).modal('hide');
                    //        document.location.reload();
                    //    }
                    //);
                } else { alert('图片上传过程中出现未知错误！'); }
            });
            xhr_upload.send(formData);
        });
    }
    modal.querySelector('.btn.btn-primary').addEventListener('click', onModalSubmit);
};
    
})();
