$(function() {
	var startDate = currentDay(6);
	var endDate = currentDay(0);
	//请求首页数据
	var successfunction = dataRequest; //设定回掉函数
	var posturl = '' + ipAddress + '/offer/getHeadPage?startDate='+startDate+'&endDate='+endDate;
	ajaxGet(posturl, successfunction);
	
});

//填充首页数据
function dataRequest(data){
	console.log(data);
	if(StringEqual(data.success,true)){
		var _data=JSON.parse(data.data);
		console.log(_data)
		$("#dataTotal").find('h3').eq(0).text(_data.totalClick);
		$('#dataTotal').find('h3').eq(1).text(_data.totalCvs);
		$('#dataTotal').find('h3').eq(2).text('$'+_data.totalIncome.toFixed(3));
		$('#dataTotal').find('span').text(currentDay(6)+' to '+currentDay(0))
		eindexChartData(_data);
	}else if(StringEqual(data.code,4)){
//			alert(data.message);
			var user = JSON.parse(getCookie("cpaChannel") || "[]");
			setCookie("cpaChannel", JSON.stringify(user), -1);
			window.location.href="../login.html";
	}else{
		console.log(data.message);
	}
}


//整理ecahrts所需数据格式
function eindexChartData(data){
	//eindexCharts填充
	var dateArr = [],clickArr = [],cvsArr = [],incomeArr = [];
	dateArr = data.dateArr;//日期数组
	clickArr = data.clickByDateArr;//点击数组
	cvsArr = data.cvsByDateArr;//转化数组
	for(var i = 0; i< data.incomeByDateArr.length;i++){
		incomeArr.push(data.incomeByDateArr[i].toFixed(3))
	}
//	incomeArr = data.incomeByDateArr;//收入数组
	drawindexCharts(dateArr, clickArr, cvsArr, incomeArr);
}
//绘制ecahrts

function drawindexCharts(dateArr, clickArr, cvsArr, incomeArr){
	// 基于准备好的dom，初始化eindexCharts实例
	var indexChart = echarts.init(document.getElementById('chart'));
	indexChart.clear();
	indexChart.showLoading({
        text : '数据获取中',
        effect: 'whirling'
    });
	var option = {
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross',
				label: {
					backgroundColor: '#6a7985'
				}
			}
		},
		legend: {
			data: ['click', 'conversion', 'revenue($)'],
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
		xAxis: [{
			type: 'category',
			boundaryGap: false,
			data: dateArr
		}],
		yAxis: [{
			type: 'value',
			name: 'click',
			axisLabel: {
				interval:0,
                rotate:60
			}
		},{
			type: 'value',
			name: 'conversion',
			axisLabel: {
				interval:0,
                rotate:40
			}
		},{
			type: 'value',
			name: 'revenue',
			axisLabel: {
				formatter: '${value}',
				interval:0,
                rotate:40
			},
			position:'left',
            offset:40
		}],
		series: [{
			name: 'click',
			type: 'line',
			smooth: true,
			yAxisIndex:0,
			data: clickArr
		}, {
			name: 'conversion',
			type: 'line',
			smooth: true,
			yAxisIndex:1,
			data: cvsArr
		}, {
			name: 'revenue($)',
			type: 'line',
			smooth: true,
			yAxisIndex:2,
			data: incomeArr
		}]
	}
	indexChart.hideLoading();
	// 使用刚指定的配置项和数据显示图表。
	indexChart.setOption(option);
	console.log(option)
}
