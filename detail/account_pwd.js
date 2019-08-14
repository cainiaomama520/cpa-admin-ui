$(function(){
	addLegalCheck();
	passwordEditData();
	checkNewPwd();
});




function checkNewPwd(){
	$("#aginPwd").on("keydown keyup change blur", function () {
		
		var pwd1=$("#newPwd").val();
		if(pwd1.length > 0){
			var aginPwd=$(this).val();
		 	if(!StringEqual(aginPwd,pwd1)){
		 		$(".newPwd").css("display","inline");
		       	$(this).css("border-color","red");
		 	}else{
		 		$(".newPwd").css("display","none");
		       	$(this).css("border-color","#e5e6e7");
		 	}
		}		 	
	})
	$("#newPwd").on("keydown keyup change blur", function () {
		var pwd2=$("#aginPwd").val();
		if(pwd2.length > 0){
			var newPwd=$(this).val();
		 	if(!StringEqual(newPwd,pwd2)){
		 		$(".newPwd").css("display","inline");
		       	$("#aginPwd").css("border-color","red");
		 	}else{
		 		$(".newPwd").css("display","none");
		       	$("#aginPwd").css("border-color","#e5e6e7");
		 	}
		}
	 	
	})
}



//点击保存发送编辑页面数据
function passwordEditData(){
	
	$("#buy").on("click",function(){
		$("[data-required]:visible").each(function () {
			var value_length=$(this).val().length;
			if(value_length <= 0){
				flag=false;
			}else{
				flag=true;           
			}				
		});
		flag = checkIsLegal();
		if($(".newPwd").is(':visible') == true){
			flag=false;
		}
		if(flag == true){
			var passwd=$.trim($("#accountPwd").val());
			var passwdNew=$.trim($("#aginPwd").val());
			var email = $.trim($(".userName").text());
			var posturl=''+ipAddress+'/user/changeUserPasswd';
			var postdata = {
				"email": email,
				"passwd": passwd,
				"passwdNew":passwdNew
			};
			postdata = JSON.stringify(postdata);
			var successfunction=passwordEditReponse;	//设定回掉函数
			ajaxPost(posturl,postdata,successfunction);
			return false;
		}else{
			alert("请填写完整并正确的内容");
		}
	})
}




//编辑页面完成后返回值函数
function passwordEditReponse(data){
	console.log(data);
		if(StringEqual(data.success,true)){
			alert('修改密码成功！')
			var user = JSON.parse(getCookie("cpaChannel") || "[]");
			setCookie("cpaChannel", JSON.stringify(user), -1);
			window.location.href="../login.html";
		}else{
			console.log(data.message);
		}
	}
	

