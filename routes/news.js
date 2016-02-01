var express = require('express');
var router = express.Router();
var config = require('./config');
var mysql = require('mysql');



var parseTime = function(ts) {
  var d = Date.parse(ts);
  var newDate = new Date();
  newDate.setTime(d);
  return(newDate.toLocaleDateString());
};

function sortByKey(array, key) {
  return array.sort(function(a, b) {
    var x = parseInt(a[key]);
    var y = parseInt(b[key]);

    return ((x < y) ? 1 : ((x > y) ? -1 : 0));
  });
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  var connection = mysql.createConnection(config);
  connection.connect()
  connection.query('select * from news', function(err, rows, fields) {
    if (err) throw err;
    var newslist = [];
    rows.forEach(function (item){
      if (item['enable']) {
        parseTime(item["updateTime"]);
        newslist.push({'id': item['id'], 'title': item['title'], 'desc': item['desc'],
          'time': parseTime(item['updateTime']), 'stamp': Date.parse(item['updateTime']),  'img': item['img']});
      }
    });
    res.render('newsList', {
      'newslist':sortByKey(newslist, 'stamp'),
      'tabs':[
        {'tab': "首页", 'path': '/', 'current': false},
        {'tab':"所有资讯", 'path':"/news/", 'current':true}
      ]
    });
    connection.end();
  });
});

router.get('/exhibit/', function(req, res, next) {
  var connection = mysql.createConnection(config);
  connection.connect()
  connection.query('select * from news where cat=1', function(err, rows, fields) {
    if (err) throw err;
    var newslist = [];
    rows.forEach(function (item){
      if (item['enable']) {
        newslist.push({'id': item['id'], 'title': item['title'], 'desc': item['desc'],
          'time': parseTime(item['updateTime']), 'stamp': Date.parse(item['updateTime']),  'img': item['img']});
      }
    });
    res.render('newsList', {
      'newslist':sortByKey(newslist, 'stamp'),
      'tabs':[
        {'tab': "首页", 'path': '/', 'current': false},
        {'tab': "展会资讯", 'path': '/news/exhibit/', 'current':true}
      ]
    });
    connection.end();
  });
});

router.get('/exhibit/inter', function(req, res, next) {
  var connection = mysql.createConnection(config);
  connection.connect()
  connection.query('select * from news where cat=1 and subcat=1', function(err, rows, fields) {
    if (err) throw err;
    var newslist = [];
    rows.forEach(function (item){
      if (item['enable']) {
        newslist.push({'id': item['id'], 'title': item['title'], 'desc': item['desc'],
          'time': parseTime(item['updateTime']), 'stamp': Date.parse(item['updateTime']),  'img': item['img']});
      }
    });
    res.render('newsList', {
      'newslist':sortByKey(newslist, 'stamp'),
      'tabs':[
        {'tab': "首页", 'path': '/', 'current': false},
        {'tab': "展会资讯", 'path': '/news/exhibit/', 'current':false},
        {'tab': "国际展会", 'path': 'news/exhibit/inter', 'current':true}
      ]
    });
    connection.end();
  });
});

router.get('/exhibit/dome', function(req, res, next) {
  var connection = mysql.createConnection(config);
  connection.connect()
  connection.query('select * from news where cat=1 and subcat=2', function(err, rows, fields) {
    if (err) throw err;
    var newslist = [];
    rows.forEach(function (item){
      if (item['enable']) {
        newslist.push({'id': item['id'], 'title': item['title'], 'desc': item['desc'],
          'time': parseTime(item['updateTime']), 'stamp': Date.parse(item['updateTime']),  'img': item['img']});
      }
    });
    res.render('newsList', {
      'newslist':sortByKey(newslist, 'stamp'),
      'tabs':[
        {'tab': "首页", 'path': '/', 'current': false},
        {'tab': "展会资讯", 'path': '/news/exhibit/', 'current':false},
        {'tab': "国内展会", 'path': '/news/exhibit/dome', 'current':true}
      ]
    });
    connection.end();
  });
});

router.get('/auction', function(req, res, next) {
  var connection = mysql.createConnection(config);
  connection.connect()
  connection.query('select * from news where cat=2', function(err, rows, fields) {
    if (err) throw err;
    var newslist = [];
    rows.forEach(function (item){
      if (item['enable']) {
        newslist.push({'id': item['id'], 'title': item['title'], 'desc': item['desc'],
          'time': parseTime(item['updateTime']), 'stamp': Date.parse(item['updateTime']),  'img': item['img']});
      }
    });
    res.render('newsList', {
      'newslist':sortByKey(newslist, 'stamp'),
      'tabs':[
        {'tab': "首页", 'path': '/', 'current': false},
        {'tab': "拍卖资讯", 'path': 'news/auction/', 'current':true},
      ]
    });
    connection.end();
  });
});


router.get('/exhibit/union', function(req, res, next){
  var connection = mysql.createConnection(config);
  connection.connect()
  connection.query('select * from news where cat=1 and subcat=3', function(err, rows, fields) {
    if (err) throw err;
    var newslist = [];
    rows.forEach(function (item){
      if (item['enable']) {
        newslist.push({'id': item['id'], 'title': item['title'], 'desc': item['desc'],
          'time': parseTime(item['updateTime']), 'stamp': Date.parse(item['updateTime']),  'img': item['img']});
      }
    });
    res.render('newsList', {
      'newslist':sortByKey(newslist, 'stamp'),
      'tabs':[
        {'tab': "首页", 'path': '/', 'current': false},
        {'tab': "展会资讯", 'path': '/news/exhibit/', 'current':false},
        {'tab': "联合展会", 'path': '/news/exhibit/union', 'current':true}
      ]
    });
    connection.end();
  });
});


router.get('/auction/dome', function(req, res, next) {
  var connection = mysql.createConnection(config);
  connection.connect()
  connection.query('select * from news where cat=2 and subcat=1', function(err, rows, fields) {
    if (err) throw err;
    var newslist = [];
    rows.forEach(function (item){
      if (item['enable']) {
        newslist.push({'id': item['id'], 'title': item['title'], 'desc': item['desc'],
          'time': parseTime(item['updateTime']), 'stamp': Date.parse(item['updateTime']),  'img': item['img']});
      }
    });
    res.render('newsList', {
      'newslist':sortByKey(newslist, 'stamp'),
      'tabs':[
        {'tab': "首页", 'path': '/', 'current': false},
        {'tab': "拍卖资讯", 'path': '/news/auction/', 'current':false},
        {'tab': "国内拍卖", 'path': '/news/auction/dome', 'current':true}
      ]
    });
    connection.end();
  });
});


router.get('/auction/inter', function(req, res, next) {
  var connection = mysql.createConnection(config);
  connection.connect()
  connection.query('select * from news where cat=2 and subcat=2', function(err, rows, fields) {
    if (err) throw err;
    var newslist = [];
    rows.forEach(function (item){
      if (item['enable']) {
        newslist.push({'id': item['id'], 'title': item['title'], 'desc': item['desc'],
          'time': parseTime(item['updateTime']), 'stamp': Date.parse(item['updateTime']),  'img': item['img']});
      }
    });
    res.render('newsList', {
      'newslist':sortByKey(newslist, 'stamp'),
      'tabs':[
        {'tab': "首页", 'path': '/', 'current': false},
        {'tab': "拍卖资讯", 'path': '/news/auction/', 'current':false},
        {'tab': "国际拍卖", 'path': '/news/auction/inter', 'current':true}
      ]
    });
    connection.end();
  });
});



router.get('/auction/union', function(req, res, next) {
  var connection = mysql.createConnection(config);
  connection.connect()
  connection.query('select * from news where cat=2 and subcat=3', function(err, rows, fields) {
    if (err) throw err;
    var newslist = [];
    rows.forEach(function (item){
      if (item['enable']) {
        newslist.push({'id': item['id'], 'title': item['title'], 'desc': item['desc'],
          'time': parseTime(item['updateTime']), 'stamp': Date.parse(item['updateTime']),  'img': item['img']});
      }
    });
    res.render('newsList', {
      'newslist':sortByKey(newslist, 'stamp'),
      'tabs':[
        {'tab': "首页", 'path': '/', 'current': false},
        {'tab': "拍卖资讯", 'path': '/news/auction/', 'current':false},
        {'tab': "联合拍卖", 'path': '/news/auction/union', 'current':true}
      ]
    });
    connection.end();
  });
});



router.get('/auciton/public', function(req, res, next) {
  var connection = mysql.createConnection(config);
  connection.connect()
  connection.query('select * from news where cat=2 and subcat=4', function(err, rows, fields) {
    if (err) throw err;
    var newslist = [];
    rows.forEach(function (item){
      if (item['enable']) {
        newslist.push({'id': item['id'], 'title': item['title'], 'desc': item['desc'],
          'time': parseTime(item['updateTime']), 'stamp': Date.parse(item['updateTime']),  'img': item['img']});
      }
    });
    res.render('newsList', {
      'newslist':sortByKey(newslist, 'stamp'),
      'tabs':[
        {'tab': "首页", 'path': '/', 'current': false},
        {'tab': "拍卖资讯", 'path': '/news/auction/', 'current':false},
        {'tab': "公益拍卖", 'path': '/news/auction/public', 'current':true}
      ]
    });
    connection.end();
  });
});



router.get('/acti', function(req, res, next) {
  var connection = mysql.createConnection(config);
  connection.connect()
  connection.query('select * from news where cat=3', function(err, rows, fields) {
    if (err) throw err;
    var newslist = [];
    rows.forEach(function (item){
      if (item['enable']) {
        newslist.push({'id': item['id'], 'title': item['title'], 'desc': item['desc'],
          'time': parseTime(item['updateTime']), 'stamp': Date.parse(item['updateTime']),  'img': item['img']});
      }
    });
    res.render('newsList', {
      'newslist':sortByKey(newslist, 'stamp'),
      'tabs':[
        {'tab': "首页", 'path': '/', 'current': false},
        {'tab': "活动咨询", 'path': '/news/acti/', 'current':true},
      ]
    });
    connection.end();
  });
});



router.get('/post/:id', function(req, res, next) {
  var newsid = req.params.id;
  var newsContent = {};
  var connection = mysql.createConnection(config);
  connection.connect()
  connection.query('select * from news where id=' + newsid, function(err, rows, fields) {
    if (err) throw err;
    rows.forEach(function(item) {
      if (item["enable"]) {
        newsContent['title'] = item['title'];
        newsContent['content'] = item['content'];
        newsContent['time'] = parseTime(item['updateTime']);
      }
    })
  });
  res.render('newsContent', {content: newsContent});
  connection.end();
});

module.exports = router;
