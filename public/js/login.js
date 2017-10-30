$(function() {

    var baseUrl = location.protocol + '//' + location.host;

    $(".btn").click(function() {

        var name = $('.name').val();
        var pwd = $(".password").val();

        var postData = {
				name : name,
				password : pwd
			}
					
		if(name == "") {
            alert('请输入用户名');
            return;
        }

        if(pwd == "") {
            alert('请输入密码');
            return;
        }

         $.ajax({
	        url: baseUrl + "/api/login",
	        type: 'POST',
	        dataType: 'json',
	        data: postData
	      })
	      .done(function (res) {
             if(res.status == 200) {
									alert("登录成功");
									location.href = './';
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


    })
})