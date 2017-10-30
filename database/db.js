var mongoose = require('mongoose');

var url = 'mongodb://localhost:27017/product';


var db = mongoose.connect(url);

db.connection.on('open',function() {
    console.log('数据库链接成功');
});

db.connection.on('error',function() {
    console.log('数据库链接失败');
})