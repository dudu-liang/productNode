$(function() {

    var baseUrl = location.protocol + '//' + location.host;
  
    $(".push-btn").click(function() {
        var name = $('.name').val();
        var description = $('.desc').val();
        var price = $('.price').val();
        var createTime = new Date().getTime();
        var image = $('.show-img').attr('src');
        var reg = /^[0-9]*$/;

        if(name == "") {
            alert('请输入商品名称');
            return;
        }

        if(description == "") {
            alert('请输入商品描述');
            return;
        }

        if(price == "") {
            alert('请输入商品价格');
            return;
        }

        if(!reg.test(price)) {
            alert('请输入正确的价格,纯数字');
            return;
        }

        if(!image || image == '') {
            alert('请上传商品图片');
            return;
        }

        var postData = {
            'name' : name,
            'description' : description,
            'price' : price,
            'createTime' : createTime,
            'image' : image
        }

        $.ajax({
	        url: baseUrl + "/api/push",
	        type: 'POST',
	        dataType: 'json',
	        data: postData
	      })
	      .done(function (res) {
            if(res.status == 200) {
                alert("商品发布成功");
                location.href = './';
            }else if(res.status == 201){
                alert(res.message);
                location.href = './login';
            }
	      })
	      .fail(function () {
	        console.log("error");
	      })
	      .always(function () {
	        console.log("complete");
          });
              
    });

    //图片上传

    $('#upload').on('change',function(event) {
        
        var file = event.target.files;
        var data = new FormData();

        data.append('thumbnail',file[0]);

        $.ajax({

            cache: false,
            type: 'post',
            dataType: 'json',
            url:'/api/upload',
            data : data,
            contentType: false,
            processData: false,
            success : function (res) { 
                if(res.status == 200) {
                    $('.show-img').attr('src',res.data);
                }
            }

        });

    });
    
});