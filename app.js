
var express = require('express');

var app = express();

var hbs = require('hbs');

var bodyParser = require('body-parser');

var cookieParser = require('cookie-parser');

var multipart = require('connect-multiparty');  //上传图片中间件

var router = require('./routes/route');

require('./database/db');


app.set('view engine','html');

app.engine('.html',hbs.__express);  //指定模板为html

/*
    中间件
*/

app.use(bodyParser({uploadDir:'./public/upload'}));  //body消息体解析

app.use(cookieParser());

app.use(multipart());

app.use(express.static('./public'))  //静态资源

app.use(router);  //路由


app.listen(8000);


