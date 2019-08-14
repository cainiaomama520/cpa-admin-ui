$(function() {
	//请求订单列表数据
	var successfunction = offerRequest; //设定回掉函数
	var posturl = '' + ipAddress + '/offer/getOrderList?page=1&size=10';
	ajaxGet(posturl, successfunction);
	searchBindEvent();
});
function offerRequest(data){
	console.log(data);
	if(StringEqual(data.success,true)){
		var _data=JSON.parse(data.data);
		var totalCount=_data.count;
		var totalPage=Math.ceil(Number(totalCount)/10);
		$(".userCount").text('Total '+totalCount+' items,')
		$(".currpage").text(_data.page);
		$(".totalpage").text(totalPage);
		$(".nextPage").attr("disabled",false)
		$(".prevPage").attr("disabled",false)
		offerList(_data.items)
	}else if(StringEqual(data.code,4)){
//			alert(data.message);
			var user = JSON.parse(getCookie("cpaChannel") || "[]");
			setCookie("cpaChannel", JSON.stringify(user), -1);
			window.location.href="../login.html";
	}else{
		console.log(data.message);
	}	
}

function offerList(_data){
	console.log(_data);
	$("#offerList tbody").empty();
	var _tr='',_td='';
	for(var i = 0; i < _data.length; i++) {
		_tr+='<tr>';
		_td='<td>'+_data[i].offerId+'</td>'
			+'<td>'+_data[i].offerName+'</td>'	
			+'<td>'+_data[i].packageName+'</td>'
			+'<td>$'+_data[i].price+'</td>'
			+'<td style="max-width:170px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;cursor:pointer;" title="国家：'+_data[i].countries+'">'+_data[i].countries+'</td>'
			+'<td>'+_data[i].dayCap+'</td>'
			+'<td><a href="'+_data[i].previewUrl+'" target="_blank">preview</a></td>'
			+'<td>'+_data[i].status+'</td>';
		_tr+=_td+'</tr>';
	}
		$("#offerList tbody").html(_tr);
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
		var offerid=$("#offerId").val();
    	var offerName=$("#offerName").val();
		var successfunction=offerRequest;	//设定回掉函数
		if(StringEqual(offerid,'') && StringEqual(offerName,'')){
    		var posturl=''+ipAddress+'/offer/getOrderList?page='+(currpage-1)+'&size=10';
    	}else{
    		var posturl=''+ipAddress+'/offer/getOrderList?offerId='+offerid+'&offerName='+offerName+'&page='+(currpage-1)+'&size=10';
    	}
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
		var offerid=$("#offerId").val();
    	var offerName=$("#offerName").val();
    	if(StringEqual(offerid,'') && StringEqual(offerName,'')){
    		var posturl=''+ipAddress+'/offer/getOrderList?page='+(currpage+1)+'&size=10';
    	}else{
    		var posturl=''+ipAddress+'/offer/getOrderList?offerId='+offerid+'&offerName='+offerName+'&page='+(currpage+1)+'&size=10';
    	}
			var successfunction=offerRequest;	//设定回掉函数
			ajaxGet(posturl,successfunction);
	}
		$('body,html').animate({scrollTop:0},1000);
}


//输入框系列搜索函数
function searchBindEvent(){
	var e = event || window.event;
    if(e && e.keyCode == 13){//一个表单下，如果只有一个文本框时，按下回车将会触发表单的提交事件。可以采取两种方法解决这种问题：1.去掉表单；2.如果非得用表单，只要不让表单里有且只有一个文本框就OK了。
    	var offerid=$("#offerId").val();
    	var offerName=$("#offerName").val();
    	if(StringEqual(offerid,'') && StringEqual(offerName,'')){
    		var postdata=''
    	}else{
    		var postdata='&offerId='+offerid+'&offerName='+offerName;
    	}
    	
		searchEvent(postdata);
    }
}

$("#searchSubmit").on("click",function(){
	var offerid=$("#offerId").val();
	var offerName=$("#offerName").val();
	if(StringEqual(offerid,'') && StringEqual(offerName,'')){
    		var postdata=''
    	}else{
    		var postdata='&offerId='+offerid+'&offerName='+offerName;
    	}
	searchEvent(postdata);
})


//ajax上传搜索时所需的数据
function searchEvent(postdata){
	var posturl=''+ipAddress+'/offer/getOrderList?page=1&size=10'+postdata;
	console.log(posturl);
	var successfunction=offerRequest;
	ajaxGet(posturl,successfunction);
}