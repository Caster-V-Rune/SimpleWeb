
var router = require('express').Router();

var path = require('path');
var multer = require('multer');

// stackoverflow.com/questions/32184589/renaming-an-uploaded-file-using-multer-doesnt-work-express-js
function generateFileName(req, file, cb) {
    // TODO: more extensions
    var allowedExtensions = {
        '.png': true,
        '.jpg': true,
        '.jpeg': true,
        '.bmp': true
    };
    // 'originalname', not 'originalName'!
    var extNameWithDot = path.extname(file.originalname).toLowerCase();
    
    if (allowedExtensions[extNameWithDot] == true) {
        // TODO: strengthen it, avoid possible conflict
        var randomString = (Math.random().toString(36) + '000000').substring(2, 6);
        var fileName = Date.now().toString() + randomString;
        cb(null, fileName + extNameWithDot);
    } else {
        cb(new Error('prohibited file extension'));
    }
}

var upload_image_storage = multer.diskStorage({
    'destination': 'public/images/user',
    'filename': generateFileName
});
var upload_image = multer({
    'storage': upload_image_storage,
    'limits': {
        'fileSize': 16*1024*1024,
        'files': 1
    },
});

router.post('/image', upload_image.single('image'),
function (req, res, next) {
    // TODO: user permission
    if (req.file) {
        if (!req.file.mimetype.startsWith('image/')) {
            return res.status(400).json({
                'status': 400,
                'message': 'you should upload an image'
            });
        }
        res.status(201).json({
            'status': 201,
            'filename': req.file.filename
        });
    } else {
        res.status(400).json({
            'status': 400,
            'message': 'unknown error, no file is uploaded'
        });
    }
});

module.exports = router;
