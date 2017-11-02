var express = require('express');

var router = express.Router();

var crypto = require('crypto');

var user = require('../database/user');

var product = require('../database/product');

var fs = require('fs');

var path = require('path');


router.get('/',function(req,res) {
    res.render('index',{
        title : '首页'
    })
});

router.get('/login',function(req,res) {

    var account = req.cookies["account"];
    if(account) {
        res.redirect('/');
    }else{
        res.render('login',{
            title : '登录'
        })
    }
    
});

router.get('/register',function(req,res) {
    res.render('register',{
        title : '注册'
    })
});


router.get('/push',function(req,res) {

    var account = req.cookies["account"];

    // account = true; //测试

    if(!account || account == "") {
        res.redirect('/login');
    }else{
        res.render('push',{
            title : '发布商品'
        })
    }
    
});

/*
   api接口
*/

var registerUser = function(data,callback) {

    var userOne = new user(data);

    userOne.save(function(err,data) {
        if(err) {
            console.log(err);
        }else{
            console.log("用户创建成功");
            console.log(data);
            if(callback) callback();
        }
    });
}

var pushProduct = function(data,callback) {

    var productOne = new product(data);

    productOne.save(function(err,data) {
        if(err) {
            console.log(err);
        }else{
            if(callback) callback();
        }
    });
}

function hashPW(userName, pwd){
  var hash = crypto.createHash('md5');
  hash.update(userName + pwd);
  return hash.digest('hex');
}


//登录
router.post('/api/login',function(req,res) {

    var name = req.body.name;

    var password = req.body.password;

    var query = {
        name : name,
        password : password
    }

    var hash = hashPW(name, password);

    user.find(query,function(err,docs) {
            if(err) {
                console.log('find user error');
            }else{
                if(docs.length == 0) {
                    res.send({
                        status : 500,
                        message : '用户名或密码错误'
                    });
                }else{
                    res.cookie("account", {account: name, hash: hash}, {maxAge: 86400000});
                    res.send({
                        status : 200,
                        message : 'login success'
                    });
                }
            }
        });

});

//注册
router.post('/api/register',function(req,res) {

    var name = req.body.name;

    var password = req.body.password;

    var query = {
        name : name,
        password : password
    }

        user.find({
            name : name
        },function(err,docs) {
            if(err) {
                console.log('find user error');
            }else{
                if(docs.length == 0) {
                    //注册用户
                    registerUser(query,function(data) {
                            var hash = hashPW(name, password);
                            res.cookie("account", {account: name, hash: hash}, {maxAge: 86400000});
                            res.send({
                                status : 200,
                                message : 'register success'
                            });
                    })
                }else{
                    res.send({
                        status : 500,
                        message : '用户已存在'
                    });
                }
            }
        });

});

//退出登录
router.get('/api/logout', function(req, res, next){
  res.clearCookie("account");
  res.send({
      status : 200,
      message : '退出登录成功'
  });
});

//商品发布
router.post('/api/push',function(req,res) {

    var name = req.body.name;

    var description = req.body.description;

    var price = req.body.price;

    var createTime = req.body.createTime;

    var image = req.body.image;

    var account = req.cookies["account"];

    if(!account || account == "") {
        res.send({
            status : 201,
            message : '还未登录，请先登录'
        });
    }

    var user = account['account'];

    var query = {
        'name' : name,
        'description' : description,
        'price' : price,
        'createTime' : createTime,
        'user' : user,
        'image' : image
    }
    pushProduct(query,function(data) {
            res.send({
                status : 200,
                message : 'push success'
            });

    })

});

//获取商品列表
router.get('/api/productList',function(req,res) {
    
    product.find({},function(err,docs) {
        if(err) {
            console.log(err);
            res.send({
                status : 500,
                message : '获取商品列表失败',
                data : []
            });
        }else{
            res.send({
                status : 200,
                data : docs,
                message : '获取商品列表成功'
            })
        }

    })

});

//商品图片
router.post('/api/upload',function(req,res) {

    console.log(999);
    console.log(req.files);
     var tmp_path = req.files.thumbnail.path;
     var time = new Date().getTime();
     var target_path = './public/upload/' + time + req.files.thumbnail.name;
        // 移动文件
        fs.rename(tmp_path, target_path, function(err) {
        if (err) throw err;
            // 删除临时文件夹文件, 
            fs.unlink(tmp_path, function() {
                if (err) throw err;
                res.send({
                    status : 200,
                    message : 'File uploaded to: ' + target_path + ' - ' + req.files.thumbnail.size + ' bytes',
                    data : target_path.replace('/public','')
                });
            });
        });

})



module.exports = router;