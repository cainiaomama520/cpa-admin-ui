function checkIsLegal(){
    var flag=true;
    $("[data-check],[data-required]").each(function () {
        $(this).trigger("change");
        var errorNum=$(".error-info:visible").length;
        if(errorNum>0){
            flag=false;
            return false;
        }else{
            flag=true;
            return true;
        }
    });
    return flag;
}
function addLegalCheck(){
	
    $("[data-check],[data-required]").on("keydown keyup change blur", function () {
        var data = $(this).data("check");
        var value = $(this).val();
        //alert(value);
        var required=$(this).data("required");
        if(required && value.trim()==""){
			//console.log(value)
            addErrorInfo(this,"This is a required item！");		
            return;
        }else{	
            removeErrorInfo(this);
            if (data == "url") {
                testError(/^http.?:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/, value, this, "网址格式不正确！");
            } else if (data == "phone") {
    //            testError(/^[\d\+\-\s]*[]$/, value, this, "手机号格式不正确！");
              testError(/^[\d\-\+\s]*$/, value, this, "号码格式不正确！");
            } else if (data == "number") {//^[\+\-]?\d*?\.?\d*?$
               // testError(/^\d+(\.\d{1,2})?$/, value, this, "只能输入正数和小数点,小数点最多两位！");
               testError(/^(?:0\.\d{1,2}|(?!0)\d+(?:\.\d{1,2})?)$/, value, this, "只能输入正数和小数点,小数点最多两位！");
            }else if(data=='email'){
                testError( /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/, value, this, "邮箱格式不正确！");
            }else if(data=='paseIntNum'){
                // testError(/^([0-9]\d{0,1}|100)$/, value, this, "只能输入0-100的整数！");
				// testError(/(^(-)?([0-9]\d{0,3}|10000)$)|([0-9]\d{0,1}|100)$/, value, this, "只能输入100及以下的整数！");
				testError(/^((\-[0-9]\d{0,3}|-10000)|0|([1-9][0-9]?)|100)$/, value, this, "只能输入-10000-100的整数！");
            }else if(data == "http") {
            	 testError(/^http.?/, value, this, "必须以http开头！");
            }else if(data == 'hundred'){
            	testError(/^([1-9]\d{0,1}|100)$/, value, this, "只能输入1-100的正整数！");
            }else if(data == 'nbsp'){
            	testError(/^((?![\-\|\s]).)+$/, value, this, "不能包含空格、“-”、“|”特殊字符！");
            }else if(data == 'pwd'){
            	testError(/^[\w\W]{6,16}$/, value, this, "Password length needs 6-16 bits！");
            }else if(data == 'nameCheck'){
            	testError(/^((?![\-\|]).)+$/, value, this, "名称中不能包含“-”、“|”特殊字符！");
            }else if(data == 'num'){
            	testError(/^[0-9]*$/, value, this, "须为纯数字！");
            }else if(data == 'integer'){
            	testError(/^\+?[1-9][0-9]*$/, value, this, "只能输入正整数！");
            }
        }
    });
}
function testError(reg,value,e,tip){
    if(value==""||reg.test(value)) {
        removeErrorInfo(e);		
    } else{
        addErrorInfo(e, tip);
    }
}
function removeErrorInfo(e) {
    if ($(e).parent().next(".error-info").length > 0) {
        $(e).parent().removeClass("has-error");
        $(e).parent().next(".error-info").remove();
    }
}
function addErrorInfo(e,tip) {
    if ($(e).parent().next(".error-info").length > 0) {
        $(e).parent().next(".error-info").html(tip);
    } else {
        $(e).parent().addClass("has-error");
        $(e).parent().after("<small class='error-info'style='line-height:"+$(e).parent().height()+"px;'>"+tip+"</small>");
    }

}