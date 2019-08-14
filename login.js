$(function() {
	checkLoginCode();

})

$(document).keydown(function(e) {
	e = e || window.event;
	var keycode = e.which ? e.which : e.keyCode;
	if (keycode == 13) {
		$("#login").click();
	}
});

function checkLoginCode() {

	$("#login").on("click", function() {
		var username = $.trim($("#userName").val());
		var pwd = $.trim($("#passWord").val());
		if (username == "" || pwd == "") {
			$(".error-info").css("display", "block");
		} else {
			$(".error-info").css("display", "none");
			var postdata = {
				"email": username,
				"passwd": pwd
			};
			postdata = JSON.stringify(postdata);
			console.log(postdata);
			 var posturl = 'http://channel.cpa.online.mobcastlead.com/user/login';
//			var posturl = 'http://192.168.20.8:8090/user/login'
			var successfunction = checkUser(username);
			ajaxPost(posturl, postdata, successfunction);
		}
	})
}

function checkUser(username) {
	return function(data) {
		console.log(data);
		var user = [];

		if (StringEqual(data.success, true)) {
			$(".error-info").css("display", "none");
			var cpaChannel = {
				"tokenInfo": data.data,
				"username": username,
			};
			user.push(cpaChannel);
			console.log(cpaChannel);
			setCookie("cpaChannel", JSON.stringify(user));
			window.location.href = "detail/index.html";

		} else {
			$(".error-info").css("display", "block");
			alert(data.message);
		}
	}

}

//ajax上传数据的主函数

function ajaxPost(posturl, postdata, successfunction) {
	$.ajax({
		contentType: "application/json; charset=utf-8",
		url: posturl,
		type: 'POST',
		dataType: 'json',
		data: postdata,
		cache: false,
		async: true, //是否异步请求
		success: successfunction,
		complete: showdata,
		statusCode: {
			404: ajaxset_alert
		},
		error: errorHandling
	});
}

function showdata(data) {
	console.dir("ajax completes response :  ");
	console.dir(data);
}

function ajaxset_alert() {
	alert("没有找到相关文件 or Url");
}

function errorHandling(xml) {
	alert(xml.responseText + " \n ");
}

function StringEqual(string1, string2) {
	return $.trim(string1) == $.trim(string2) ? true : false;
}
