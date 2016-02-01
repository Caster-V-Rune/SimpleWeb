var express = require('express');
var router = express.Router();
var async = require('async');
var config = require('./config');

/* GET home page. */
router.get('/', function(req, res, next) {
    var mysql = require('mysql');
    var connection = mysql.createConnection(config);
    connection.connect();
    async.parallel([(callback) => (
            connection.query('select * from section_img', function(err, rows, fields) {
                if (err) throw err;
                var sections = [];
                rows.forEach(function (item){
                    if (item['enable']) {
                        sections.push({'id': 'section'+item['id'], 'url': item['url'], 'link': item['link']});
                    }
                });
                callback(null, sections);
            })),
        (callback) =>
    connection.query('select * from slides_img', function(err, rows, fields) {
        if (err) throw err;
        var slides = [];
        rows.forEach(function (item){
            if (item['enable']){
                slides.push({'id':'#slide'+item['id'], 'url': item['url']});
            }
        });
        callback(null, slides);
    }),
        (callback) =>
    connection.query('select * from docker_info', function(err, rows, fields) {
        if (err) throw err;
        var docker = [];
        rows.forEach(function (item){
            if (item['enable']){
                if (item['type']==0){
                    item['value'] = item['value'];
                }
                else if (item['type']==1){
                    item['value'] = '<img src="'+item['value']+'">';
                }
                docker[item['name']] = item['value'];
            }
        });
        callback(null, docker);
    }),
        (callback) =>
    connection.query('select * from header_type', function(err, rows, fields) {
        if (err) throw err;
        var header_type = [], i = 1;
        rows.forEach(function (item){
            if (item['enable']) {
                header_type.push({'id': item['id'], 'value': item['name'], second_service: [], 'slide': 'slide'+i});
            }
        });
        callback(null, header_type);
    }),
        (callback) =>
    connection.query('select * from contact_info', function(err, rows, fields) {
        if (err) throw err;
        var contact_info = [];
        rows.forEach(function (item){
            if (item['enable']) {
                contact_info.push({'name': item['name'], 'value': item['value']});
            }
        });
        callback(null, contact_info);
    }),
        (callback) =>
    connection.query('select * from second_service', function(err, rows, fields) {
        if (err) throw err;
        var second_service = [];
        rows.forEach(function (item){
            if (item['enable']) {
                second_service.push({
                    'id': item['id'],
                    'header_id': item['header_id'],
                    'name': item['name'],
                    'icon_url': item['icon_url'],
                    'link_url': item['link_url'],
                    'third_service': []
                });
            }
        });
        callback(null, second_service);
    }),
        (callback) =>
    connection.query('select * from third_service', function(err, rows, fields) {
        if (err) throw err;
        var third_service = [];
        rows.forEach(function (item){
            if (item['enable']) {
                third_service.push({
                    'id': item['id'],
                    'second_id': item['second_id'],
                    'name': item['name'],
                    'link_url': item['link_url']
                });
            }
        });
        callback(null, third_service);
    })
    ],
    function(err, results){
        connection.end();


        results[6].forEach(function(e){
            results[5][e['second_id']].third_service.push({
                'name': e['name'],
                'link_url': e['link_url']
            });
        });
        results[5].forEach(function(e){
            results[3][e['header_id']].second_service.push({
                'name': e['name'],
                'icon_url': e['icon_url'],
                'link_url': e['link_url'],
                'third_service': e['third_service']
            });
        });
        var first_section = results[3][0];
        var middle_section = [];
        middle_section.push(results[3][1]);
        middle_section.push(results[3][2]);
        middle_section.push(results[3][3]);
        middle_section.push(results[3][4]);
        middle_section.push(results[3][5]);
        var final_section = results[3][6];
        console.log(middle_section);
        //0 6
        //1 2 3 4
        var argv = {
            slides: results[1],
            sections: results[0],
            docker: results[2],
            header_type: results[3],
            contact_info: results[4],
            first_section: first_section,
            middle_section: middle_section,
            final_section: final_section
        };
        res.render('index', argv);
    });


});

module.exports = router;
