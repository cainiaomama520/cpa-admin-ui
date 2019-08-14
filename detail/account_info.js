$(function() {
	var email = $.trim($(".userName").text());
	//请求账户信息数据
	var successfunction = infoRequest; //设定回掉函数
	var posturl = '' + ipAddress + '/user/getChannelInfo?email='+email;
	ajaxGet(posturl, successfunction);
	
});

//填充账户信息
function infoRequest(data){
	
	if(StringEqual(data.success,true)){
		var _data=JSON.parse(data.data)
		console.log(_data);
		$("#id").text(_data.id);
		$('#name').text(_data.name);
		$('#email').text(_data.email);
		$("#contact_num").text(_data.contact_num);
		var postback='';
		for(var i=0;i<_data.universal_cb.length;i++){
			postback+=_data.universal_cb[i].link+'<br/>'
		}
		$('#universal_cb').html(postback);
	}else if(StringEqual(data.code,4)){
//			alert(data.message);
			var user = JSON.parse(getCookie("cpaChannel") || "[]");
			setCookie("cpaChannel", JSON.stringify(user), -1);
			window.location.href="../login.html";
	}else{
		console.log(data.message);
	}
}