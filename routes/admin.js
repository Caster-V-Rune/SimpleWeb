var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var async = require('async');
var fs = require('fs');
var crypto = require('crypto');
var config = require('./config');
function md5 (text) {
  return crypto.createHash('md5').update(text).digest('hex');
};
var admin_upload = require('./admin_upload');
router.use('/upload', admin_upload);

var mid = function(req, res, next){
  if (req.session !== undefined && req.session['user']){
    next();
  }
  else{
    res.redirect('/admin/login');
  }
}

var connection = mysql.createConnection(config);

function decodeBase64Image(dataString) {
  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  var response = {};
  if (matches.length !== 3) {
    return new Error('Invalid input string');
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');
  return response;
}

function getRandomString(len) {　
  var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';　
  var maxPos = $chars.length;　
  var pwd = '';　
  for (var i = 0; i < len; i++) {　　
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));　
  }　
  return pwd;
}

function getImgName() {
  var curTimestamp = Date.parse(new Date()) / 1000;
  var randomstr = getRandomString(5);
  var userid = curTimestamp + randomstr;
  return userid;
}

/* GET users listing. */
router.post('/login', function(req, res, next) {
  var user = req.body.user;
  var password = req.body.password;
  var argv = {};
  console.log(config);
  if ((user === undefined) && (password === undefined)) {
    res.render('login', argv);
  }
  else {
    var connection = mysql.createConnection(config);

    connection.connect();
    connection.query('select * from user where name=?',[user], function(err, rows, fields) {
      if (err) throw err;
      console.log(md5(password));
      if (rows && rows[0] && md5(password)===rows[0]['password']){
          req.session.user = user;
          res.redirect('/admin');
      }
      else {
        res.render('login',{message: 'error user name or password'});
      }
      connection.end;
    });
  }
});

router.get('/login', function(req, res, next) {
  if (req.session && req.session.user) {
    res.redirect('/admin/cms');
  }
  else {
    var argv = {};
    res.render('login', argv);
  }
});

router.get('/logout', function(req, res, next) {
  req.session.user = null;
  res.redirect('/admin/cms');

});

router.get('/', mid, function(req, res, next) {
  if (true) {
    res.redirect('/admin/cms');
  } else {
    res.redirect('/admin/login');
  }
});

router.get('/cms', mid, function(req, res, next) {
  var argv = { };
  var connection = mysql.createConnection(config);

  connection.connect();
  connection.query('select * from section_img', function(err, rows, fields) {
    if (err) throw err;
    var sections = [];
    rows.forEach(function (item){
      if (item['enable']) {
        sections.push({'id': 'section'+item['id'], 'url': item['url'], 'link': item['link']}) }
    });
    argv['sections'] = sections;
    console.log(sections);
    connection.query("SELECT * FROM `header_type`", function(err, rows, fields){
      if (err) throw err;
      var list1 = {};
      rows.forEach(function(e,i){
        console.log(i);
        list1[i] = e['name'];
      });
      connection.query("SELECT * FROM `second_service`", function(err, rows, fields){
        if (err) throw err;
        var list2 = {};
        rows.forEach(function(e,i){
          console.log(i);
          list2[i] = e['name'];
        });

        argv['f0'] = list1[0];
        argv['f1'] = list1[1];
        argv['f2'] = list1[2];
        argv['f3'] = list1[3];
        argv['f4'] = list1[4];
        argv['f5'] = list1[5];
        argv['f6'] = list1[6];
        argv['s10'] = list2[0];
        argv['s11'] = list2[1];
        argv['s12'] = list2[2];
        argv['s20'] = list2[3];
        argv['s21'] = list2[4];
        argv['s22'] = list2[5];
        argv['s23'] = list2[6];
        argv['s30'] = list2[7];
        argv['s31'] = list2[8];
        argv['s32'] = list2[9];
        argv['s40'] = list2[10];
        argv['s41'] = list2[11];
        argv['s42'] = list2[12];
        argv['s43'] = list2[13];
        argv['s50'] = list2[14];
        argv['s51'] = list2[15];
        argv['s52'] = list2[16];
        res.render('cms', argv);
        connection.end();

      });
    });

  });
});

router.get('/newsManage', mid, function(req, res, next) {
  var connection = mysql.createConnection(config);

  connection.connect();
  connection.query('select * from news', function(err, rows, fields) {
    if (err) throw err;
    var sections = [];
    rows.forEach(function(item) {
      if (item['enable']) {
        var id = item['id'];
        var title = item['title'];
        var content = item['content'];
        var cat = item['cat'];
        var subcat = item['subcat'];
        var updateTime = item['updateTime'];
        switch (cat) {
          case 1:
            cat = '展会资讯';
            break;
          case 2:
            cat = '拍卖资讯';
            break;
          case 3:
            cat = '活动资讯';
            break;
        }
        var obj = {
          'id': id,
          'title': title,
          'content': content,
          'cat': cat,
          'subcat': subcat,
          'updateTime': updateTime
        }
        sections.push(obj);
      }
    });
    var argv = {};
    connection.query("SELECT * FROM `header_type`", function(err, rows, fields){
      if (err) throw err;
      var list1 = {};
      rows.forEach(function(e,i){
        console.log(i);
        list1[i] = e['name'];
      });
      connection.query("SELECT * FROM `second_service`", function(err, rows, fields){
        if (err) throw err;
        var list2 = {};
        rows.forEach(function(e,i){
          console.log(i);
          list2[i] = e['name'];
        });

        argv['f0'] = list1[0];
        argv['f1'] = list1[1];
        argv['f2'] = list1[2];
        argv['f3'] = list1[3];
        argv['f4'] = list1[4];
        argv['f5'] = list1[5];
        argv['f6'] = list1[6];
        argv['s10'] = list2[0];
        argv['s11'] = list2[1];
        argv['s12'] = list2[2];
        argv['s20'] = list2[3];
        argv['s21'] = list2[4];
        argv['s22'] = list2[5];
        argv['s23'] = list2[6];
        argv['s30'] = list2[7];
        argv['s31'] = list2[8];
        argv['s32'] = list2[9];
        argv['s40'] = list2[10];
        argv['s41'] = list2[11];
        argv['s42'] = list2[12];
        argv['s43'] = list2[13];
        argv['s50'] = list2[14];
        argv['s51'] = list2[15];
        argv['s52'] = list2[16];
        argv['posts'] = sections;
        res.render('cms-news', argv);
        connection.end();

      });
    });

  });
});

router.post('/delPost', function(req, res, next) {
  var id = req.body.id;
  var query = 'delete from news where id=' + id;
  var connection = mysql.createConnection(config);
  connection.query(query, function(err, rows, fields) {
    if (err) throw err;
    res.send('ok');
    connection.end();
  });
});

router.post('/savePost', function(req, res, next) {
  // 还需要传入一个新闻类别
  var category = req.body.category;
  var cat, subcat;
  if (category == '0') {
    cat = 1, subcat = 1;
  } else if (category == '1') {
    cat = 1;
    subcat = 2;
  } else if (category == '2') {
    cat = 1;
    subcat = 3;
  } else if (category == '3') {
    cat = 2;
    subcat = 1;
  } else if (category == '4') {
    cat = 2;
    subcat = 2;
  } else if (category == '5') {
    cat = 2;
    subcat = 3;
  } else if (category == '6') {
    cat = 2;
    subcat = 4;
  } else {
    cat = 3;
    subcat = 1;
  }

  var argv = {};
  var title = req.body.title;
  var content = req.body.content;
  var desc = req.body.desc;
  var img = "nopic";
  var m, urls = [],
      rex = /<img.*?src="([^">]*\/([^">]*?))".*?>/g;

  while (m = rex.exec(content)) {
    urls.push(m[1]);
  }

  if (urls.length > 0) {
    for (var i = 0; i < urls.length; i++) {
      var imageBuffer = decodeBase64Image(urls[i]);
      var userUploadedFeedMessagesLocation = './public/images/news/';
      var imageTypeRegularExpression = /\/(.*?)$/;
      var imageTypeDetected = imageBuffer.type.match(imageTypeRegularExpression);
      var imageName = getImgName();
      var userUploadedImagePath = userUploadedFeedMessagesLocation +
          imageName +
          '.' +
          imageTypeDetected[1];
      var repimgName = '/images/news/' + imageName + '.' + imageTypeDetected[1];
      content = content.replace(urls[i], repimgName);
      if (i == 0) img = repimgName;
      // console.log(userUploadedImagePath + '\n\n');
      fs.writeFile(userUploadedImagePath, imageBuffer.data, function(err) {
        console.log('save images error: ' + err);
      });
    }
  }
  if (img == "nopic") {
    img = "/images/news1.png";
  }
  // console.log('post here' + title + content);
  var connection = mysql.createConnection(config);

  var query = "insert into news values(NULL, '" + title + "', '" + content + "', " + cat + ", " + subcat + ", 1, NULL, '" + desc + "', '" + img + "')";
  connection.query(query, function(err, rows, fields) {
    if (err) throw err; // 将对应的数据存入数据库
    res.send("successfully saved the post in the database");
    connection.end();
  });
});

router.post('/modify', function(req, res, next) {
  var table = req.body.table,
    id_name = req.body.id_name,
    id = req.body.id,
    value = req.body.value,
    value_name = req.body.name;
  var q = 'update ' + table + ' set ' + value_name + '="' + value + '" where ' + id_name + '=' + id;
  var connection = mysql.createConnection(config);

  connection.connect();
  connection.query(q, function(err, rows, fields) {
    if (err) throw err;
    connection.end();
  });

  res.send(0);
});

router.get('/cms/:id/:tid', mid, function(req, res, next) {
  var argv = {};
  if (req.params.tid == 0){
    var connection = mysql.createConnection(config);

    connection.connect();

    async.parallel([
          (callback) =>
        connection.query('select * from slides_img where id="'+req.params.id+'"', function(err, rows, fields) {
          if (err) throw err;
          var slides = [];
          rows.forEach(function (item){
            console.log(item);
            if (item['enable']){
              slides['id'] = req.params.id;
              slides['url'] = item['url'];
            }
          });
          callback(null, slides);
        }),
        (callback) =>
    connection.query('select * from header_type where id="'+req.params.id+'"', function(err, rows, fields) {
      if (err) throw err;
      var header_type = '';
      rows.forEach(function (item){
        if (item['enable']) {
          header_type = item['name'];
        }
      });
      callback(null, header_type);
    })
  ],
    function(err, results){

      var argv = {
        slides: results[0],
        header_type: results[1],
      };

      console.log(argv);
      connection.query("SELECT * FROM `header_type`", function(err, rows, fields){
        if (err) throw err;
        var list1 = {};
        rows.forEach(function(e,i){
          console.log(i);
          list1[i] = e['name'];
        });
        connection.query("SELECT * FROM `second_service`", function(err, rows, fields){
          if (err) throw err;
          var list2 = {};
          rows.forEach(function(e,i){
            console.log(i);
            list2[i] = e['name'];
          });

          argv['f0'] = list1[0];
          argv['f1'] = list1[1];
          argv['f2'] = list1[2];
          argv['f3'] = list1[3];
          argv['f4'] = list1[4];
          argv['f5'] = list1[5];
          argv['f6'] = list1[6];
          argv['s10'] = list2[0];
          argv['s11'] = list2[1];
          argv['s12'] = list2[2];
          argv['s20'] = list2[3];
          argv['s21'] = list2[4];
          argv['s22'] = list2[5];
          argv['s23'] = list2[6];
          argv['s30'] = list2[7];
          argv['s31'] = list2[8];
          argv['s32'] = list2[9];
          argv['s40'] = list2[10];
          argv['s41'] = list2[11];
          argv['s42'] = list2[12];
          argv['s43'] = list2[13];
          argv['s50'] = list2[14];
          argv['s51'] = list2[15];
          argv['s52'] = list2[16];
          console.log(list1);console.log(list2);
          res.render('modify-bkground', argv);

          connection.end();

        });
      });

    });
  } else {
    var connection = mysql.createConnection(config);
    connection.connect();
    connection.query('SELECT * FROM second_service WHERE header_id = ?', [ req.params['id'] ],
        function (err, rows, fields) {
          if (err) { throw err; }
          rows = rows[req.params['tid']-1];
          var second_id = rows['id'];
          var title = rows['name'], link_url = rows['link_url'];
          var icon_url = rows['icon_url'];
          connection.query('SELECT * FROM third_service WHERE second_id = ?', [ second_id ],
              function (err, rows, fields) {
                var argv = {
                  'slides': req.params['id'],
                  'third_titles': rows,
                  title, icon_url, link_url,
                  'header_id': req.params['id'],
                  second_id
                };
                connection.query("SELECT * FROM `header_type`", function(err, rows, fields){
                  if (err) throw err;
                  var list1 = {};
                  rows.forEach(function(e,i){
                    console.log(i);
                    list1[i] = e['name'];
                  });
                  connection.query("SELECT * FROM `second_service`", function(err, rows, fields){
                    if (err) throw err;
                    var list2 = {};
                    rows.forEach(function(e,i){
                      console.log(i);
                      list2[i] = e['name'];
                    });

                    argv['f0'] = list1[0];
                    argv['f1'] = list1[1];
                    argv['f2'] = list1[2];
                    argv['f3'] = list1[3];
                    argv['f4'] = list1[4];
                    argv['f5'] = list1[5];
                    argv['f6'] = list1[6];
                    argv['s10'] = list2[0];
                    argv['s11'] = list2[1];
                    argv['s12'] = list2[2];
                    argv['s20'] = list2[3];
                    argv['s21'] = list2[4];
                    argv['s22'] = list2[5];
                    argv['s23'] = list2[6];
                    argv['s30'] = list2[7];
                    argv['s31'] = list2[8];
                    argv['s32'] = list2[9];
                    argv['s40'] = list2[10];
                    argv['s41'] = list2[11];
                    argv['s42'] = list2[12];
                    argv['s43'] = list2[13];
                    argv['s50'] = list2[14];
                    argv['s51'] = list2[15];
                    argv['s52'] = list2[16];
                    res.render('modify-icons', argv);
                    connection.end();

                  });
                });

              });
        });
  }
});

router.post('/cms/modify_image', function (req, res, next) {
  var connection = mysql.createConnection(config);

  connection.connect();
  // TODO: pretty awesome duplication
  //      that's where CPP shines
  if (req.body['second_id'] === undefined && req.body['slides_id'] === undefined) {
    connection.query('UPDATE slides_img SET url = ? WHERE id = ?',
        [ req.body['image'], parseInt(req.body['primary_id']) ],
        function (err, rows, fields) {
          if (err) { console.log(err); }
          res.json({ 'status': 200, 'succeeded': true });
        }
    );
  } else if (req.body['slides_id'] === undefined) {
    connection.query('UPDATE second_service SET icon_url = ? WHERE id = ?',
        [ req.body['image'], parseInt(req.body['second_id']) ],
        function (err, rows, fields) {
          if (err) { console.log(err); }
          res.json({ 'status': 200, 'succeeded': true });
          connection.end();
        }
    );
  } else {
    // slides_id
    // slides in the first slide of INDEX page
    connection.query('UPDATE section_img SET url = ? WHERE id = ?',
        [ req.body['image'], parseInt(req.body['slides_id']) ],
        function (err, rows, fields) {
          if (err) { console.log(err); }
          res.json({ 'status': 200, 'succeeded': true });
          connection.end();
        }
    );
  }
});

router.post('/cms/:id/:tid', function (req, res, next) {
  var connection = mysql.createConnection(config);

  connection.connect();
  connection.query('UPDATE second_service SET name = ?, link_url = ? WHERE id = ?',
      [ req.body['name'], req.body['link_url'], req.body['second_id'] ],
      function (err, rows, fields) {
        connection.query('DELETE FROM third_service WHERE second_id = ?',
            [ req.body['second_id'] ],
            function (err, rows, fields) {
              if (err) { console.log(err); }
              async.parallel(req.body['third_titles'].map((title) =>
              (callback) =>
              connection.query('INSERT INTO third_service (second_id, name, link_url) VALUES (?, ?, ?)',
                  [ req.body['second_id'], title['name'], title['link_url'] ],
                  (err, rows, fields) =>
              err ? callback(err) : callback(null)))
              , function (err, results) {
                if (err) { console.log(err); }
                res.json({ 'status': 200, 'succeeded': true });
                connection.end();
              });
            });
      });
});

router.get('/cms/6', mid, function(req, res, next) {
  var argv = {};
  var connection = mysql.createConnection(config);

  connection.connect();
  connection.query("SELECT * FROM `header_type`", function(err, rows, fields){
    if (err) throw err;
    var list1 = {};
    rows.forEach(function(e,i){
      console.log(i);
      list1[i] = e['name'];
    });
    connection.query("SELECT * FROM `second_service`", function(err, rows, fields){
      if (err) throw err;
      var list2 = {};
      rows.forEach(function(e,i){
        console.log(i);
        list2[i] = e['name'];
      });

      argv['f0'] = list1[0];
      argv['f1'] = list1[1];
      argv['f2'] = list1[2];
      argv['f3'] = list1[3];
      argv['f4'] = list1[4];
      argv['f5'] = list1[5];
      argv['f6'] = list1[6];
      argv['s10'] = list2[0];
      argv['s11'] = list2[1];
      argv['s12'] = list2[2];
      argv['s20'] = list2[3];
      argv['s21'] = list2[4];
      argv['s22'] = list2[5];
      argv['s23'] = list2[6];
      argv['s30'] = list2[7];
      argv['s31'] = list2[8];
      argv['s32'] = list2[9];
      argv['s40'] = list2[10];
      argv['s41'] = list2[11];
      argv['s42'] = list2[12];
      argv['s43'] = list2[13];
      argv['s50'] = list2[14];
      argv['s51'] = list2[15];
      argv['s52'] = list2[16];
      connection.query('SELECT * FROM `contact_info`',function (err, rows, fields){
        if (err) throw err;
        rows.forEach(function(e){
          switch (e['id']){
            case 1:
              argv['com'] = e['value'];
              break;
            case 2:
              argv['addr'] = e['value'];
              break;
            case 3:
              argv['name'] = e['value'];
              break;
            case 4:
              argv['position'] = e['value'];
              break;
            case 5:
              argv['postcode'] = e['value'];
              break;
          }

        });
        res.render('cms-slide', argv);
        connection.end();
      });


    });
  });

});

router.post('/updateInfo', function(req, res, next){
  var com = req.body.com,
      addr = req.body.addr,
      name = req.body.name,
      position = req.body.position,
      postcode = req.body.postcode;
  var connection = mysql.createConnection(config);

  connection.connect();
  connection.query('UPDATE contact_info SET value = ? WHERE id = 1',
      [ com ],
      function (err, rows, fields) {
        if (err) throw err;
        connection.query('UPDATE contact_info SET value = ? WHERE id = 2',
            [ addr ],
            function (err, rows, fields) {
              if (err) throw err;
              connection.query('UPDATE contact_info SET value = ? WHERE id = 3',
                  [ name ],
                  function (err, rows, fields) {
                    if (err) throw err;
                    connection.query('UPDATE contact_info SET value = ? WHERE id = 4',
                        [ position ],
                        function (err, rows, fields) {
                          if (err) throw err;
                          connection.query('UPDATE contact_info SET value = ? WHERE id = 5',
                              [ postcode ],
                              function (err, rows, fields) {
                                if (err) throw err;
                                res.send('ok');
                                connection.end();
                              });
                        });
                  });
            });
      });
});

router.post('/updateSectionLink', function(req, res, next){
  var connection = mysql.createConnection(config);

  connection.connect();
  connection.query('UPDATE section_img SET link = ? WHERE id = ?',
      [ req.body.link, req.body.id ],
      function (err, rows, fields) {
        if (err) throw err;
        res.send('ok');
        connection.end();
      });
});

router.post('/modify', function(req, res, next) {
  var table = req.body.table,
      id_name = req.body.id_name,
      id = req.body.id,
      value = req.body.value,
      value_name = req.body.name;
  var q = 'update '+table+' set '+value_name+'="'+value+'" where '+id_name+'='+id;
  console.log(q);
  var mysql = require('mysql');
  var connection = mysql.createConnection(config);

  connection.connect();
  connection.query(q, function(err, rows, fields) {
    if (err) throw err;
    res.send(0);

    connection.end();
  });

});



var type_list = {
  0: '陶器逸珍',
  1: '瓷器逸珍',
  2: '木器逸珍',
  3: '玉器逸珍'
};

router.get('/exhibit', function(req, res, next) {
  var connection = mysql.createConnection(config);

  connection.connect();
  connection.query('select * from exhibit', function(err, rows, fields) {
    if (err) throw err;
    var sections = [];
    rows.forEach(function(item) {
      if (item['enable']) {
        var id = item['id'];
        var title = item['name'];
        var content = item['description'];
        var cat = type_list[item['type']];
        var obj = {
          'id': id,
          'title': title,
          'content': content,
          'cat': cat
        };
        sections.push(obj);
      }
    });
    connection.query("SELECT * FROM `header_type`", function(err, rows, fields){
      if (err) throw err;
      var list1 = {};
      rows.forEach(function(e,i){
        console.log(i);
        list1[i] = e['name'];
      });
      connection.query("SELECT * FROM `second_service`", function(err, rows, fields){
        if (err) throw err;
        var list2 = {};
        rows.forEach(function(e,i){
          console.log(i);
          list2[i] = e['name'];
        });
        var argv = {};
        argv['f0'] = list1[0];
        argv['f1'] = list1[1];
        argv['f2'] = list1[2];
        argv['f3'] = list1[3];
        argv['f4'] = list1[4];
        argv['f5'] = list1[5];
        argv['f6'] = list1[6];
        argv['s10'] = list2[0];
        argv['s11'] = list2[1];
        argv['s12'] = list2[2];
        argv['s20'] = list2[3];
        argv['s21'] = list2[4];
        argv['s22'] = list2[5];
        argv['s23'] = list2[6];
        argv['s30'] = list2[7];
        argv['s31'] = list2[8];
        argv['s32'] = list2[9];
        argv['s40'] = list2[10];
        argv['s41'] = list2[11];
        argv['s42'] = list2[12];
        argv['s43'] = list2[13];
        argv['s50'] = list2[14];
        argv['s51'] = list2[15];
        argv['s52'] = list2[16];
        argv['posts'] = sections;

        res.render('cms-exhibit', argv);
        connection.end();

      });
    });


  });

});

router.post('/exhibit/del', function(req, res, next) {
  var id = req.body.id;
  var query = 'delete from exhibit where id=' + id
  var connection = mysql.createConnection(config);
  connection.connect();
  connection.query(query, function(err, rows, fields) {
    if (err) throw err;
    res.send('ok');
    connection.end();
  });
});

router.post('/exhibit/save', function(req, res, next) {
  var connection = mysql.createConnection(config);

  connection.connect();
  var urls = req.body.urls;
  var name = req.body.title;
  var type = req.body.category;
  var description = req.body.content;
  var s = "(NULL, '"+name+"','"+type+"','"+description+"',";
  for(var i = 0; i < 6; i++){
    if (urls[i]===undefined){
      s += "NULL,";
    }else{
      s += ("'"+urls[i]+"',");
    }
  }
  s += "'1');";
  var query = "INSERT INTO `exhibit` (`id`, `name`, `type`, `description`, `pic1`, `pic2`, `pic3`, `pic4`, `pic5`, `pic6`, `enable`) VALUES"+s;
  connection.query(query, function(err, rows, fields) {
    if (err) throw err;
    res.send('ok');
    connection.end();
  });
});

router.post('/exhibit/delImg', function(req, res, next){
  fs.unlink('./public/images/user/'+req.body.img, function(e){
    if (e) throw e;
    res.send('ok');
  });
});

router.get('/updatePasswd', mid, function(req, res, next){
  res.render('cms-passwd');
});

router.post('/updatePasswd', function(req, res, next){
  var username = req.body.username,
      passwd = req.body.passwd;
  var connection = mysql.createConnection(config);

  connection.connect();
  connection.query("UPDATE `user` SET `name` = ? WHERE `user`.`id` = 1;",[username],function(err, rows, fields) {
    if (err) throw err;
    connection.query("UPDATE `user` SET `password` = ? WHERE `user`.`id` = 1;",[md5(passwd)],function(err, rows, fields) {
      if (err) throw err;
      res.send('ok');
      connection.end();
    });
  });
});
module.exports = router;
