$(function() {
	var user = JSON.parse(getCookie("cpaChannel") || "[]");
	if (!user[0]) {
		window.location.href = "../login.html";
	} else if (user[0]) {
		$("#token").html(user[0].tokenInfo);
		$(".userName").text(user[0].username);
	}

	//请求左侧导航栏列表函数
	ajaxRequest("get", "../js/navLeft.json", false, null, function(data) {
		var data = JSON.parse(data);
		navigation(data);
	});
	checkUrlActive(); //判断左侧导航栏需要加active的元素
	replaceAllLogoLink();
	replaceAllLogoutLink();
	try {
		addLegalCheck();
	} catch (e) {
		console.log("no need style");
	}
});


// var ipAddress = "http://192.168.20.8:8090";
   var ipAddress = "http://channel.cpa.online.mobcastlead.com";

//左侧导航栏列表回调函数
function navigation(data) {
	console.log(data);
	var _data = data.functionObj;
	var _li = '<li class="header">版本 V1.0</li>';
	for (var i = 0; i < _data.length; i++) {
		_li += '<li class="treeview"><a href="' + _data[i].functionUrl + '"><i class="iconfont ' + _data[i].iconUrl + '" style="font-size: 14px;margin-right:8px;"></i><span style="height: 44px;">' + _data[i].functionName + '</span>';
		if(_data[i].functionNestedObj.length > 0){
			_li+='<span class="pull-right-container"><i class="fa fa-angle-left pull-right"></i></span></a><ul  class="treeview-menu">';
			for (var key in _data[i].functionNestedObj) {
				_li += '<li><a href="' + _data[i].functionNestedObj[key].functionUrl + '"><i class="iconfont ' + _data[i].functionNestedObj[key].iconUrl + '" style="margin-right:8px;"></i>' + _data[i].functionNestedObj[key].functionName + '</a></li>';
			}
			_li += "</ul></li>"
		}
	}
	$(".sidebar-menu").html(_li);
}

function checkUrlActive() {
	var _url = window.location.href;
	var linkLeft = $(".sidebar-menu a");
	$.each(linkLeft, function(i, item) {
		var href = $(this).attr('href');
		var hrefDetail = href.substring(9, href.length - 5);
		if (_url.indexOf(hrefDetail) > -1 && hrefDetail.length > 0) {
			$(this).parent('li').addClass("active");
			$(this).parent('li').parent('ul').parent('li').addClass("treeview active");
		}
		var hrefAE = hrefDetail.split("_")[0];
		if (_url.indexOf(hrefAE) > -1 && hrefAE.length > 0) {
			$(this).parent('li').parent('ul').parent('li').addClass("treeview active");
		}
	});
}

//替换所有页面的logo链接
function replaceAllLogoLink() {
	var logo = $(".logo");
	logo.attr("href", "../detail/index.html");
}

//替换所有页面的退出链接
function replaceAllLogoutLink() {
	var logout = $(".logout");

	logout.on("click", function() {
		var user = JSON.parse(getCookie("cpaChannel") || "[]");
		setCookie("cpaChannel", JSON.stringify(user), -1);
		logout.attr("href", "../login.html");
	})
}
function currentDay(n) {
	 var n = n;
    var d = new Date();
    var year = d.getFullYear();
    var mon = d.getMonth() + 1;
    var day = d.getDate();
    if(day <= n) {
        if(mon > 1) {
            mon = mon - 1;
        } else {
            year = year - 1;
            mon = 12;
        }
    }
    d.setDate(d.getDate() - n);
    year = d.getFullYear();
    mon = d.getMonth() + 1;
    day = d.getDate();
    s = year + "-" + (mon < 10 ? ('0' + mon) : mon) + "-" + (day < 10 ? ('0' + day) : day);
    return s;
}

function ajaxPost(posturl, postdata, successfunction) {
	var user = JSON.parse(getCookie("cpaChannel") || "[]");
	var token = user[0].tokenInfo;
	$.ajax({
		contentType: "application/json; charset=utf-8",
		url: posturl,
		beforeSend: function(request) {
			request.setRequestHeader( "Authorization" , token);
		},
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

function ajaxPut(posturl, postdata, successfunction) {
	var user = JSON.parse(getCookie("cpaChannel") || "[]");
	var token = user[0].tokenInfo;
	$.ajax({
		contentType: "application/json; charset=utf-8",
		url: posturl,
		beforeSend: function(request) {
			request.setRequestHeader( "Authorization" , token);
		},
		type: 'PUT',
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



function ajaxGet(posturl, successfunction) {
	var user = JSON.parse(getCookie("cpaChannel") || "[]");
	var token = user[0].tokenInfo;
	$.ajax({
		url: posturl,
		beforeSend: function(request) {
			request.setRequestHeader( "Authorization" , token);
		},
		type: 'GET',
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

function ajaxExportGet(posturl, successfunction) {
	var user = JSON.parse(getCookie("cpaChannel") || "[]");
	var token = user[0].tokenInfo;
	$.ajax({
		contentType: "application/octet-stream",
		url: posturl,
		beforeSend: function(request) {
			request.setRequestHeader( "Authorization" , token);
		},
		type: 'GET',
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
	console.dir(data);
}

function ajaxset_alert() {
	console.dir("没有找到相关文件 or Url");
}

function errorHandling(xml) {
	console.dir(xml.responseText + " \n ");
}


function StringEqual(string1, string2) {
	return $.trim(string1) == $.trim(string2) ? true : false;
};

Date.prototype.Format = function(fmt) { //author: meizz
	var o = {
		"M+": this.getMonth() + 1, //月份
		"d+": this.getDate(), //日
		"h+": this.getHours(), //小时
		"m+": this.getMinutes(), //分
		"s+": this.getSeconds(), //秒
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度
		"S": this.getMilliseconds() //毫秒
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}

function addDate(date, days) {
    if (days == undefined || days == '') {
        days = 1;
    }
    date = new Date(date);
    date.setDate(date.getDate() + days);
    let month = date.getMonth() + 1;
    let day = date.getDate();
    return date.getFullYear() + '-' + getFormatDate(month) + '-' + getFormatDate(day);
}
function getFormatDate(arg) {
    if (arg == undefined || arg == '') {
        return '';
    }

    var re = arg + '';
    if (re.length < 2) {
        re = '0' + re;
    }

    return re;
}
//获取前七天的日期
function generateDate7Days() {
    let today = new Date().Format("yyyy-MM-dd");

    let result = [today];
    for (let i = -1; i > -7; i--) {
        let tmp = addDate(new Date(), i);
        result.push(new Date(tmp).Format("yyyy-MM-dd"));
    }

    return result.reverse();//反转
}
//删除数组中指定值元素
function removeByValue(arr, val) {
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] == val) {
			arr.splice(i, 1);
			break;
		}
	}
}
//数组对象从大到小排列
function createComprisonFunction(propertyName){  
        return function(object1,object2){  
            var value1 = object1[propertyName];  
            var value2 = object2[propertyName];  
            if (!isNaN(Number(value1)) && !isNaN(Number(value2))) {
	            value1 = Number(value1);
	            value2 = Number(value2);
	        }  
            if(value1 < value2){  
                return 1;  
            }else if(value1 > value2){  
                return -1;  
            }else{  
                return 0;  
            }  
        }  
    }