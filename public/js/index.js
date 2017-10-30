$(function() {

    var baseUrl = location.protocol + '//' + location.host;

    function getCookie(name) {
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
            if(arr=document.cookie.match(reg)) {
                return unescape(arr[2]);
            } else {
                return null;
            }
    }

    function getList() {
        $.ajax({
	        url: baseUrl + "/api/productList",
	        type: 'GET',
	        dataType: 'json',
	        data: {}
	      })
	      .done(function (res) {
             if(res.status == 200) {
                console.log('获取商品列表成功');
                dealData(res.data);
             }else{
                alert(res.message);
             }
	      })
	      .fail(function () {
	        console.log("error");
	      })
	      .always(function () {
	        console.log("complete");
	      });
    }

    function getDetailTime(time) {
        var all = '';
        var date = new Date(time);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
            month = month < 10 ? ('0' + month) : month;
            day = day < 10 ? ('0' + day) : day;
            all = year + '/' + month + '/' + day;
            return all;
    }

    function dealData(data) {
        var html = '';
        if(data.length != 0) {
            for(var i = 0; i < data.length; i ++) {
                var time = getDetailTime(data[i].createTime);
                var image = './images/cat.jpg';
                if(typeof data[i].image != 'undefined') {
                    image = data[i].image;
                }
                html += '<div class="item">'
                            + '<div class="box" style="background-image:url(' + image + ')"></div>'
                            + '<div class="detail">'
                                + '<p class="name">'
                                    + data[i].name
                                + '</p>'
                                + '<p class="desc">'
                                    + data[i].description
                                + '</p>'
                                + '<p>'
                                    + '价格:￥'+ data[i].price
                                + '</p>'
                                + '<p>'
                                + '发布时间:' + time
                                + '</p>'
                                + '<p>'
                                    + '发布人:' + data[i].user
                                + '</p>'
                            + '</div>'
                        + '</div>';
            }
        }else{
            html += '<div class="no-data">还没发布商品哦</div>';
        }
        $('.content').html(html);
    }

    var account = getCookie('account');

    if(account && account != '') {
       $('.logout-btn').fadeIn(200);
    }

    getList(); //获取商品列表
  
    $(".c-btn").click(function() {
        window.location.href = './push';
    });

    $(".logout-btn").click(function() {
        $.ajax({
	        url: baseUrl + "/api/logout",
	        type: 'GET',
	        dataType: 'json',
	        data: {}
	      })
	      .done(function (res) {
             if(res.status == 200) {
                    alert("退出登录成功");
                    location.href = './login';
             }else{
                    alert(res.message);
             }
	      })
	      .fail(function () {
	        console.log("error");
	      })
	      .always(function () {
	        console.log("complete");
	      });
    });
    
});