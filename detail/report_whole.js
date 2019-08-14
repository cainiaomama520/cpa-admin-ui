$(function() {
	var startDate=$("#day").val().split(' - ')[0];
    var endDate=$("#day").val().split(' - ')[1];
	//请求整体数据
	var successfunction = dataRequest; //设定回掉函数
	var posturl = '' + ipAddress + '/offer/getOverallData?startDate='+startDate+'&endDate='+endDate+'&page=1&size=10';
	ajaxGet(posturl, successfunction);
	searchBindEvent();
});
//重置日期
function resetDate(){
	$('#day').data('daterangepicker').setStartDate(moment().subtract(6, 'days'));
	$('#day').data('daterangepicker').setEndDate(moment());
}

function dataRequest(data){
	
	if(StringEqual(data.success,true)){
		var _data=JSON.parse(data.data);
		var totalCount=_data.count;
		var totalPage=Math.ceil(Number(totalCount)/10);
		$(".userCount").text('Total '+totalCount+' items,')
		$(".currpage").text(_data.page);
		$(".totalpage").text(totalPage);
		$(".nextPage").attr("disabled",false)
		$(".prevPage").attr("disabled",false)
		overallData(_data)
	}else if(StringEqual(data.code,4)){
//			alert(data.message);
			var user = JSON.parse(getCookie("cpaChannel") || "[]");
			setCookie("cpaChannel", JSON.stringify(user), -1);
			window.location.href="../login.html";
	}else{
		console.log(data.message);
	}	
}

function overallData(_data){
	console.log(_data);
	
	$("#overallData tbody").empty();
	var _tr="",_td="",tfoot='';
	for(var i = 0; i < _data.list.length; i++) {
		_tr+='<tr>';
		_td='<td>'+_data.list[i].date+'</td>'
			+'<td>'+_data.list[i].campaignId+'-'+_data.list[i].campaignName+'</td>'
			+'<td>'+_data.list[i].click+'</td>'	
			+'<td>'+_data.list[i].cvs+'</td>'
			+'<td>'+_data.list[i].cvsRate.toFixed(4)+'%</td>'
			+'<td>$'+_data.list[i].income.toFixed(3)+'</td>';
		_tr+=_td+'</tr>';
		$("#overallData tbody").html(_tr);
	}
	tfoot='<tr>'
		+'<td>'+_data.total.date+'</td>'
		+'<td>--</td>'
		+'<td>'+_data.total.click+'</td>'	
		+'<td>'+_data.total.cvs+'</td>'
		+'<td>'+_data.total.cvsRate.toFixed(4)+'%</td>'
		+'<td>$'+_data.total.income.toFixed(3)+'</td>'
		+'</tr>';
	$("#overallData tfoot").html(tfoot);
	bindpageEvent();
}

//分页
function bindpageEvent(){
	var currpage=Number($(".currpage").text());
	var totalpage=Number($(".totalpage").text());
	if(currpage === totalpage || currpage > totalpage){
		$(".nextPage").attr("disabled","disabled")
	}
	if(currpage === 1){
		$(".prevPage").attr("disabled","disabled")
	}else if(currpage <= totalpage){
		$(".prevPage").attr("disabled",false)
	}
	
}
//点击上一页绑定事件
function preEvent(){
	var currpage=Number($(".currpage").text());
	var totalpage=Number($(".totalpage").text());
	if(currpage === totalpage){
		$(".nextPage").attr("disabled","disabled")
	}
	if(currpage === 1){
		$(".prevPage").attr("disabled","disabled")
	}else if(currpage <= totalpage){
		$(".prevPage").attr("disabled",false)
		$(".nextPage").attr("disabled",false)
	}
	if(currpage <= totalpage){
		var startDate=$("#day").val().split(' - ')[0];
   		var endDate=$("#day").val().split(' - ')[1];
		var successfunction=dataRequest;	//设定回掉函数
    	var posturl=''+ipAddress+'/offer/getOverallData?startDate='+startDate+'&endDate='+endDate+'&page='+(currpage-1)+'&size=10';
		ajaxGet(posturl,successfunction);
	}
	$('body,html').animate({scrollTop:0},1000);
}
//点击下一页绑定事件
function nextEvent(){
	var currpage=Number($(".currpage").text());
	var totalpage=Number($(".totalpage").text());
	if(currpage === totalpage){
		$(".nextPage").attr("disabled","disabled")
	}
	if(currpage === 1){
		$(".prevPage").attr("disabled","disabled")
	}
	if(currpage >=1 && currpage <= totalpage){
		var startDate=$("#day").val().split(' - ')[0];
   		var endDate=$("#day").val().split(' - ')[1];
    	var posturl=''+ipAddress+'/offer/getOverallData?startDate='+startDate+'&endDate='+endDate+'&page='+(currpage+1)+'&size=10';
			var successfunction=dataRequest;	//设定回掉函数
			ajaxGet(posturl,successfunction);
	}
		$('body,html').animate({scrollTop:0},1000);
}
//输入框系列搜索函数
function searchBindEvent(){
	var e = event || window.event;
    if(e && e.keyCode == 13){//一个表单下，如果只有一个文本框时，按下回车将会触发表单的提交事件。可以采取两种方法解决这种问题：1.去掉表单；2.如果非得用表单，只要不让表单里有且只有一个文本框就OK了。
    	var start=$("#day").val().split(' - ')[0];
    	var end=$("#day").val().split(' - ')[1];
    	var postdata='&startDate='+start+'&endDate='+end;
		searchEvent(postdata);
    }
}

$("#searchSubmit").on("click",function(){
	var start=$("#day").val().split(' - ')[0];
	var end=$("#day").val().split(' - ')[1];
	var postdata='&startDate='+start+'&endDate='+end;
	searchEvent(postdata);
})


//ajax上传搜索时所需的数据
function searchEvent(postdata){
	var posturl=''+ipAddress+'/offer/getOverallData?page=1&size=10'+postdata;
	console.log(posturl);
	var successfunction=dataRequest;
	ajaxGet(posturl,successfunction);
}