$(function() {

    var baseUrl = location.protocol + '//' + location.host;

    $(".btn").click(function() {

        var name = $('.name').val();
        var pwd = $(".password").val();
        var repwd = $(".repwd").val();

        if(name == "") {
            alert('请输入用户名');
            return;
        }

        if(pwd == "") {
            alert('请输入密码');
            return;
        }

        if(repwd == "") {
            alert('请输入确认密码');
            return;
        }

        if(pwd.length < 6 || pwd.length > 20) {
            alert('密码不能少于6位或大于20位');
            return;
        }

        if(pwd != repwd) {
            alert('两次输入的密码不正确');
            return;
        }

        var postData = {
            name : name,
            password : pwd
        }

         $.ajax({
	        url: baseUrl + "/api/register",
	        type: 'POST',
	        dataType: 'json',
	        data: postData
	      })
	      .done(function (res) {
              if(res.status == 200) {
                  alert("注册成功");
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