var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var config = require('./config');

var type_list = {
    0: '陶器逸珍',
    1: '瓷器逸珍',
    2: '木器逸珍',
    3: '玉器逸珍'
};
var type_list_r = {
    '陶器逸珍': 0,
    '瓷器逸珍': 1,
    '木器逸珍': 2,
    '玉器逸珍': 3
};

/* GET users listing. */
router.get('/', function(req, res, next) {
    var connection = mysql.createConnection(config);
    connection.connect();
    connection.query('select * from exhibit', function(err, rows, fields) {
        if (err) throw err;
        var exhibitlist = {
            type: req.params.type,
            exhibits: []
        };
        rows.forEach(function (item){
            if (item['enable']) {
                exhibitlist.exhibits.push({id: item['id'], name: item['name'], pic1: item['pic1']});
            }
        });
        res.render('preview', exhibitlist);
        connection.end();
    });
});

router.get('/:type', function(req, res, next) {
    if (type_list_r[req.params.type] !== undefined){
        var connection = mysql.createConnection(config);
        connection.connect();
        connection.query('select * from exhibit  where type='+type_list_r[req.params.type], function(err, rows, fields) {
            if (err) throw err;
            var exhibitlist = {
                type: req.params.type,
                exhibits: []
            };
            rows.forEach(function (item){
                if (item['enable']) {
                    exhibitlist.exhibits.push({id: item['id'], name: item['name'], pic1: item['pic1']});
                }
            });
            res.render('preview', exhibitlist);
            connection.end();
        });
    }else{
        var connection = mysql.createConnection(config);
        connection.connect();
        connection.query('select * from exhibit  where type=0', function(err, rows, fields) {
            if (err) throw err;
            var exhibitlist = {
                type: req.params.type,
                exhibits: []
            };
            rows.forEach(function (item){
                if (item['enable']) {
                    exhibitlist.exhibits.push({id: item['id'], name: item['name'], pic1: item['pic1']});
                }
            });
            res.render('preview', exhibitlist);
            connection.end();
        });
    }

});

router.get('/show/:id', function(req, res, next) {
    var eid = 0;
    if (req.params.id < 1) {
        eid = 1;
    } else {
        eid = req.params.id;
    }
    var connection = mysql.createConnection(config);
    connection.connect();
  connection.query('select * from exhibit where id='+eid, function(err, rows, fields) {
      if (err) throw err;
      var exhibitlist = {};
      rows.forEach(function (item){
          if (item['enable']) {
              exhibitlist = {
                  'id': item['id'],
                  'name': item['name'],
                  'type': type_list[item['type']],
                  'description': item['description'],
                  'pic1': item['pic1'],
                  'pic2': item['pic2'],
                  'pic3': item['pic3'],
                  'pic4': item['pic4'],
                  'pic5': item['pic5'],
                  'pic6': item['pic6']
              };

          }
      });
      res.render('exhibitPreview', exhibitlist);
      connection.end();
  });
});

module.exports = router;
