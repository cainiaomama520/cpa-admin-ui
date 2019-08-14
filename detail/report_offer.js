$(function() {
	initDropDownMenu();
	//请求订单table数据
	var startDate=$("#day").val().split(' - ')[0];
    var endDate=$("#day").val().split(' - ')[1];
    var page=1;
	var successfunction = dataRequest(page); //设定回掉函数
	var posturl = '' + ipAddress + '/offer/getOrderData_list?startDate='+startDate+'&endDate='+endDate+'&page=1&size=10';
	ajaxGet(posturl, successfunction);
	//请求图标默认数据
	var start = currentDay(6);
	var end = currentDay(0);
	var successfunction1 = clickRequest; //设定回掉函数
	var posturl1 = '' + ipAddress + '/offer/getOrderData_legend?sortField=click&offerSize=3';
	ajaxGet(posturl1, successfunction1);

	searchBindEvent();
});

//下拉框实现
function initDropDownMenu(){
	var liele=$(".dropdown-menu li");
	liele.on("click",function(event){
		var clickitem=$(this).children("a").html();
		var butn=$(this).parent("ul").parent().children("button");
		butn.html(clickitem + '<span class="caret"  style="margin-left: 4px;"></span>');
	});
}
//ajax请求返回数据
function dataRequest(page){
	return function(data){
		if(StringEqual(data.success,true)){
			var _data=JSON.parse(data.data);
			console.log(_data)
			var totalCount=_data.count;
			var totalPage=Math.ceil(Number(totalCount)/10);
			$(".userCount").text('Total '+totalCount+' items,')
			$(".currpage").text(page);
			$(".totalpage").text(totalPage);
			$(".nextPage").attr("disabled",false);
			$(".prevPage").attr("disabled",false);
			//表格填充;
			dataTable(_data.offerList);
		}else if(StringEqual(data.code,4)){
//			alert(data.message);
			var user = JSON.parse(getCookie("apiChannle") || "[]");
			setCookie("apiChannle", JSON.stringify(user), -1);
			window.location.href="../login.html";
		}else{
			console.log(data.message);
		}
	}
}
//表格填充
	function dataTable(_data){
		$("#offerData tbody").empty();
		var _tr="",_td="";
		for(var i = 0; i < _data.length; i++) { 
			_tr+='<tr">';
			_td='<td style="white-space:nowrap;">'+_data[i].date+'</td>'
			+'<td>'+_data[i].offerId+'</td>'
			+'<td>'+_data[i].offerName+'</td>'
			+'<td>'+_data[i].click+'</td>'
			+'<td>'+_data[i].cvs+'</td>'
			+'<td>$'+_data[i].income.toFixed(3)+'</td>'
			+'<td>'+_data[i].cvsRate.toFixed(4)+'%</td>';
			_tr+=_td+'</tr>';	
			
		}
		$("#offerData tbody").html(_tr);
//		table=$('#offerData').DataTable({
//			destroy:true,
//			"searching": false,
//			"ordering": false,
//			dom: 'Bfrtip',
//			buttons: ['pageLength',{
//				extend:'excel',
//				text: '导出数据',
//				title:'订单数据Excel'
//			}]
//		});
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
		var offerid=$("#offerId").val();
    	var offerName=$("#offerName").val();
    	var page=currpage-1;
		var successfunction=dataRequest(page);	//设定回掉函数
		if(StringEqual(offerid,'') && StringEqual(offerName,'')){
    		var posturl=''+ipAddress+'/offer/getOrderData_list?startDate='+startDate+'&endDate='+endDate+'&page='+(currpage-1)+'&size=10';
    	}else{
    		var posturl=''+ipAddress+'/offer/getOrderData_list?startDate='+startDate+'&endDate='+endDate+'&offerId='+offerid+'&offerName='+offerName+'&page='+(currpage-1)+'&size=10';
    	}
		ajaxGet(posturl,successfunction);
	}
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
		var offerid=$("#offerId").val();
    	var offerName=$("#offerName").val();
    	var page=currpage+1;
    	if(StringEqual(offerid,'') && StringEqual(offerName,'')){
    		var posturl=''+ipAddress+'/offer/getOrderData_list?page='+(currpage+1)+'&size=10&startDate='+startDate+'&endDate='+endDate;
    	}else{
    		var posturl=''+ipAddress+'/offer/getOrderData_list?startDate='+startDate+'&endDate='+endDate+'&offerId='+offerid+'&offerName='+offerName+'&page='+(currpage+1)+'&size=10';
    	}
			var successfunction=dataRequest(page);	//设定回掉函数
			ajaxGet(posturl,successfunction);
	}
}
	
//点击的图表数据获取
function clickRequest(data){
	if(!StringEqual(data.data,'NA')){
		var _data=JSON.parse(data.data);
		console.log(_data)
		gennerateDate(_data.dateOfferMap,"click")
	}
	
}
function cvsRequest(data){
	if(!StringEqual(data.data,'NA')){
		var _data=JSON.parse(data.data);
		console.log(_data)
		gennerateDate(_data.dateOfferMap,"cvs")
	}
}
function incomeRequest(data){
	if(!StringEqual(data.data,'NA')){
		var _data=JSON.parse(data.data);
		console.log(_data)
		gennerateDate(_data.dateOfferMap,"income")
	}
}
//规范charts所需数据格式
function gennerateDate(source,type) {
    //生成时间
    let dates = generateDate7Days();

    //生成echars series
    let infoKeys = Object.keys(source);//获取订单名称
    let series = [];
    for (let i = 0; i < infoKeys.length; i++) {
        let info = source[infoKeys[i]];
        let tmp = {};
        tmp['name'] = infoKeys[i];
        tmp['data'] = [];
        tmp['type'] = 'line';
        tmp['smooth'] = true;

        for (let k = 0; k < dates.length; k++) {
            if (info[dates[k]]) {
            	if(String(info[dates[k]].value).indexOf(".") == -1){
            		 tmp['data'].push(info[dates[k]].value);
            	}else{
            		tmp['data'].push(info[dates[k]].value.toFixed(3));
            	}
            } else {
                tmp['data'].push(0);
            }
        }
        series.push(tmp);
    } 
    if(StringEqual(type,'click')){
    	drawClickChart(dates,series);
    }else if(StringEqual(type,'cvs')){
    	drawCvsChart(dates,series);
    }else if(StringEqual(type,'income')){
    	drawIncomeChart(dates,series);
    }
}



var clickChart = echarts.init(document.getElementById('clickChartBox'));
var cvsChart = echarts.init(document.getElementById('cvsChartBox'));
var incomeChart = echarts.init(document.getElementById('incomeChartBox'));
//切换Tab标签时，重新绘制图表容器
$('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
	var checked=$("#dropdownMenu1").text().split(' ')[1];
    var size=Number(checked);
	var targetDom = $(e.target);
	if(targetDom.attr('aria-controls') == 'clickTab') {
		var start = currentDay(6);
		var end = currentDay(0);
		var successfunction = clickRequest; //设定回掉函数
		var posturl = '' + ipAddress + '/offer/getOrderData_legend?sortField=click&offerSize='+size;
		ajaxGet(posturl, successfunction);
		clickChart.resize();
	}else if(targetDom.attr('aria-controls') == 'cvsTab') {
		var start = currentDay(6);
		var end = currentDay(0);
		var successfunction = cvsRequest; //设定回掉函数
		var posturl = '' + ipAddress + '/offer/getOrderData_legend?sortField=total_cvs&offerSize='+size;
		ajaxGet(posturl, successfunction);
		cvsChart.resize();
	}else if(targetDom.attr('aria-controls') == 'incomeTab') {
		var start = currentDay(6);
		var end = currentDay(0);
		var successfunction = incomeRequest; //设定回掉函数
		var posturl = '' + ipAddress + '/offer/getOrderData_legend?sortField=income&offerSize='+size;
		ajaxGet(posturl, successfunction);
		incomeChart.resize();
	}
});
//下拉菜单变化时触发函数
$('#myDropdown').on('hide.bs.dropdown', function () {
  // do something…
  var checked=$("#dropdownMenu1").text().split(' ')[1];
  console.log(checked)
  var size=Number(checked);
  var tab=$(".nav-tabs .active").children('a').attr('aria-controls');
  if(tab == 'clickTab') {
		var start = currentDay(6);
		var end = currentDay(0);
		var successfunction = clickRequest; //设定回掉函数
		var posturl = '' + ipAddress + '/offer/getOrderData_legend?sortField=click&offerSize='+size;
		ajaxGet(posturl, successfunction);
		clickChart.resize();
	}else if(tab == 'cvsTab') {
		var start = currentDay(6);
		var end = currentDay(0);
		var successfunction = cvsRequest; //设定回掉函数
		var posturl = '' + ipAddress + '/offer/getOrderData_legend?sortField=total_cvs&offerSize='+size;
		ajaxGet(posturl, successfunction);
		cvsChart.resize();
	}else if(tab == 'incomeTab') {
		var start = currentDay(6);
		var end = currentDay(0);
		var successfunction = incomeRequest; //设定回掉函数
		var posturl = '' + ipAddress + '/offer/getOrderData_legend?sortField=income&offerSize='+size;
		ajaxGet(posturl, successfunction);
		incomeChart.resize();
	}
})


//点击展示图
function drawClickChart(dateArray,series) {
	// 基于准备好的dom，初始化echarts实例
	var clickChart = echarts.init(document.getElementById('clickChartBox'));
	clickChart.clear();
	clickChart.showLoading({
        text : '数据获取中',
        effect: 'whirling'
    });
	var clickOption = {
		title: {
            text: 'Click',
            left:'center'
        },
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross',
				label: {
					backgroundColor: '#6a7985'
				}
			},//自定义提示框内容
			formatter: function (params) {
				var res='<div>'+params[0].name+'</div>' 
				params= params.sort(createComprisonFunction("value"));
				for(var i=0;i<params.length;i++){
					res+='<div>'+params[i].marker+params[i].seriesName+'：'+params[i].value +'</div>'
				}
				return res;
			}
		},
//		legend: {
//			data: productName,
//		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
		xAxis: [{
			type: 'category',
			boundaryGap: false,
			data: dateArray
		}],
		yAxis: [{
			type: 'value',
			axisLabel: {
				interval:0,
                rotate:40
			}
		}],
		series: series
	}
	clickChart.hideLoading();
	clickChart.setOption(clickOption);
}
//转化展示图
function drawCvsChart(dateArray,series) {

	// 基于准备好的dom，初始化echarts实例
	var cvsChart = echarts.init(document.getElementById('cvsChartBox'));
	cvsChart.clear();
	cvsChart.showLoading({
        text : '数据获取中',
        effect: 'whirling'
    });
	var cvsOption = {
		title: {
            text: 'Conversion',
            left:'center'
        },
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross',
				label: {
					backgroundColor: '#6a7985'
				}
			},
			formatter: function (params) {
				var res='<div>'+params[0].name+'</div>' 
				params= params.sort(createComprisonFunction("value"));
				for(var i=0;i<params.length;i++){
					res+='<div>'+params[i].marker+params[i].seriesName+'：'+params[i].value +'</div>'
				}
				return res;
			}
		},
//		legend: {
//			data: productName,
//		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
		xAxis: [{
			type: 'category',
			boundaryGap: false,
			data: dateArray
		}],
		yAxis: [{
			type: 'value',
			axisLabel: {
				interval:0,
                rotate:40
			}
		}],
		series: series
	}
	cvsChart.hideLoading();
	cvsChart.setOption(cvsOption);
}

//收入展示图
function drawIncomeChart(dateArray,series) {

	// 基于准备好的dom，初始化echarts实例
	var incomeChart = echarts.init(document.getElementById('incomeChartBox'));
	incomeChart.clear();
	incomeChart.showLoading({
        text : '数据获取中',
        effect: 'whirling'
    });
	var incomeOption = {
		title: {
            text: 'Revenue',
            left:'center'
        },
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross',
				label: {
					backgroundColor: '#6a7985'
				}
			},
			formatter: function (params) {
//				console.log(params)
				var res='<div>'+params[0].name+'</div>' 
				params= params.sort(createComprisonFunction("value"));
				for(var i=0;i<params.length;i++){
					res+='<div>'+params[i].marker+params[i].seriesName+'：'+params[i].value +'</div>'
				}
				return res;
			}
		},
//		legend: {
//			data: productName,
//		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
		xAxis: [{
			type: 'category',
			boundaryGap: false,
			data: dateArray
		}],
		yAxis: [{
			type: 'value',
			axisLabel: {
				interval:0,
                rotate:40
			}
		}],
		series: series
	}
	incomeChart.hideLoading();
	incomeChart.setOption(incomeOption);
}

//输入框系列搜索函数
function searchBindEvent(){
	var e = event || window.event;
    if(e && e.keyCode == 13){//一个表单下，如果只有一个文本框时，按下回车将会触发表单的提交事件。可以采取两种方法解决这种问题：1.去掉表单；2.如果非得用表单，只要不让表单里有且只有一个文本框就OK了。
    	var start=$("#day").val().split(' - ')[0];
    	var end=$("#day").val().split(' - ')[1];
    	var offerId=$("#offerId").val();
    	var offerName=$("#offerName").val();
    	var postdata='&startDate='+start+'&endDate='+end+'&offerId='+offerId+'&offerName='+offerName;
		searchEvent(postdata);
    }
}

$("#searchSubmit").on("click",function(){
	var start=$("#day").val().split(' - ')[0];
	var end=$("#day").val().split(' - ')[1];
	var offerId=$("#offerId").val();
    	var offerName=$("#offerName").val();
	var postdata='&startDate='+start+'&endDate='+end+'&offerId='+offerId+'&offerName='+offerName;
	searchEvent(postdata);
})


//ajax上传搜索时所需的数据
function searchEvent(postdata){
	 var page=1;
	var posturl=''+ipAddress+'/offer/getOrderData_list?page=1&size=10'+postdata;
	console.log(posturl);
	var successfunction=dataRequest(page);
	ajaxGet(posturl,successfunction);
}

//导出报表
$("#reportDown").on("click",function(){
	var start=$("#day").val().split(' - ')[0];
	var end=$("#day").val().split(' - ')[1];
	var offerId=$("#offerId").val();
    var offerName=$("#offerName").val();
	var postdata='startDate='+start+'&endDate='+end+'&offerId='+offerId+'&offerName='+offerName;
	var posturl=''+ipAddress+'/offer/getOrderData_list_export?'+postdata;
	successfunction = exportSuccess;
	ajaxExportGet(posturl,successfunction);
})

function exportSuccess(data){
	console.log(data)
	if(StringEqual(data.success,true)){
			window.open(data.url);
	}else if(StringEqual(data.code,4)){
		var user = JSON.parse(getCookie("apiChannle") || "[]");
		setCookie("apiChannle", JSON.stringify(user), -1);
		window.location.href="../login.html";
	}else{
		console.log(data.message);
	}
}
