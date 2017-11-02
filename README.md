# productNode

nodejs+mongoDB+mongoose实现商品发布Demo，登录注册商品发布及商品列表

1.执行npm install

2.安装mongoDB，并启动mongo

3.在根目录执行node app启动服务

4.在浏览器打开http://localhost:8000即可查看项目





###前言：使用nodejs实现登录、注册、商品发布、商品列表展示Demo，通过这个demo熟悉nodejs使用，mongoDB的一些简单操作。
##一、环境准备

###1.nodejs安装

到官网下载安装包，或者在nvm上下载，我本地的node版本为v6.9.2

###2.mongoDB安装

a.第一种方法是直接下载压缩包解压

   第二种方法使用在终端brew install mongodb

b.启动mongoDB：

进入到安装mongo的目录下的mongo/bin路径下

sudo mongod


mongo启动成功
看到这个界面即mongo启动成功。

c.可以下载mongoDB图形管理工具，查看和管理数据库，我用的是Robomongo。

##二、开始写代码啦

环境准备好后，可以开始写nodejs逻辑以及页面了，你需要有的基础是：

###1.html+css+javascript前端基础

###2.npm简单操作

###3.学习node API以及express，推荐阮一峰nodejs教程，里边讲得简单明了，阮老师的教程一直都很赞

###4.项目目录结构

	├── productNode       项目根目录
	
	│   ├── database       启动监听数据库操作目录
	
	│   ├── public            静态资源文件放置目录
	
	│   ├── node_modules     npm安装包存放目录
	
	│  ├── routes            路由及接口目录
	
	│   ├── app.js              项目初始化及启动服务文件
	
	│  ├── package.json    package.json文件

###5. app.js 项目初始化及启动服务文件

	var express=require('express');
	
	var app=express();
	
	var hbs=require('hbs');
	
	var bodyParser=require('body-parser');
	
	var cookieParser=require('cookie-parser');
	
	var multipart=require('connect-multiparty');//上传图片中间件
	
	var router=require('./routes/route');
	
	require('./database/db');
	
	app.set('view engine','html');
	
	app.engine('.html',hbs.__express);//指定模板为html

	/*中间件*/
	
	app.use(bodyParser({uploadDir:'./public/upload'}));//body消息体解析
	
	app.use(cookieParser());
	
	app.use(multipart());
	
	app.use(express.static('./public'))//静态资源
	
	app.use(router);//路由
	
	app.listen(8080);

a.我这里用到的是express框架，使用了hbs模板引擎，指定模板文件为html格式的，是我们比较熟悉的格式，使用jade也可以。

	app.set('view engine','html');
	
	app.engine('.html',hbs.__express);

这两句设置使用的模板引擎。

b.

	var bodyParser=require('body-parser');
	
	app.use(bodyParser({uploadDir:'./public/upload'}));//body消息体解析

使用中间件的方式，引用你需要的模块，可在npm中安装即可，例如npm install body-parser。引用这个就能在接口请求中获取客户端发送过来的body消息体，还指定了文件上传路径为./public/upload。cookie-parser设置管理cookie的中间件，multipart文件上传的中间件，设置这个可以获取到客户端上传过来的file信息。

c.app.listen(8000)启动服务，为8000端口

###6.连接数据库 /database/db.js

	var mongoose=require('mongoose');
	
	var url='mongodb://localhost:27017/product';
	
	var db=mongoose.connect(url);
	
	db.connection.on('open',function() {
	
	console.log('数据库连接成功');
	
	});
	
	db.connection.on('error',function() {
	
	console.log('数据库连接失败');
	
	})

安装mongoose是nodejs中操作mongoDB数据库的框架，mongoose.connect('mongodb://localhost:27017/product')连接数据库，默认的端口号为27017，数据库名称为product，并监听open事件，和error事件，连接成功或连接失败都会进到相应的时间回调中。

/database/produc.js指定集合product的数据结构，创建模型

	var mongoose=require('mongoose');
	
	var Schema=mongoose.Schema;
	
	var productSchema=newSchema({
	
	      name:String,  //商品名称
	
	      description:String, //商品描述
	
	       price:Number, //商品价格
	
	       user:String,   //发布人
	
	      createTime:Number,  //商品创建时间
	
	      image:String  //商品图片路径
	
	});
	
	var product=mongoose.model('product',productSchema);
	
	module.exports=product;

###7. public静态资源文件夹

public用于存放静态资源文件，我们在app.js初始化文件中已经指定了静态资源存放的文件夹为public，里边的资源在服务启动后即可通过相应的路径访问到

	--images
	
	--upload
	
	--styles
	
	--js

以上文件夹分别用于存放图片资源，上传的图片存放位置，css样式，页面逻辑的js文件。

###8.views中用于存放html页面文件

###9.routes/route.js  路由及接口

	var express=require('express');
	
	var router=express.Router();

express框架中的Router方法。

路由

	router.get('/',function(req,res) {
	
	    res.render('index',{
	
	         title:'首页'
	
	   })
	
	});

请求匹配到/，进入到改回调中，response.render渲染index模板，我们在初始化中已经指定了模板为html格式的文件，这里就可以不用写html后缀了。用这样的方法匹配路径，渲染模板。

接口

//登录

	var user=require('../database/user');   //user集合的数据格式模型
	
	router.post('/api/login',function(req,res) {
	
	var name=req.body.name;
	
	var password=req.body.password;
	
	var query={
	
	   name:name,
	
	    password:password
	
	}
	
	var hash=hashPW(name,password);
	
	user.find(query,function(err,docs) {
	
	if(err) {
	
	        console.log('find user error');
	
	}else{
	
	     if(docs.length==0) {
	
	         res.send({
	
	             status:500,
	
	            message:'用户名或密码错误'
	
	        });
	
	      }else{
	
	            res.cookie("account", {account:name,hash:hash}, {maxAge:86400000});
	
	            res.send({
	
	               status:200,
	
	               message:'login success'	
	         });
	}
	}
	});
	
	});

匹配到客户单发送post请求/api/login后进行相应的处理，根据用户的输入账号密码查询数据库，如果没有查询到结果，res.send发送数据给客户端，没有查询到，账号或密码错误，如果数据库中查询到该用户了，返回状态码200，登录成功。登录成功并进行cookie设置，用于保持登录状态。

##三、上代码

demo里还有上传图片的代码，大家也可以参考下。喜欢的麻烦给个star哦！^_^

nodejs商品发布Demo的git地址