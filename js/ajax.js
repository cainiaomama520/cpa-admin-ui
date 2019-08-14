function createAjaxRequest(){
	try{
		return new XMLHttpRequest();
	}catch(e){
		try{
			return new ActiveXObject("MSXML2.XMLHTTP.6.0");
		}catch(e){
			try{
				return new ActiveXObject("MSXML2.XMLHTTP.3.0");
			}catch(e){
				try{
					return new ActiveXObject("MSXML.XMLHTTP");
				}catch(e){
					return("浏览器版本太低，请升级浏览器版本");
				}
			}
		}
	}
}
function ajaxRequest(_method,_url,_async,_parameter,_fn){
	var _ajax=createAjaxRequest();
	if(_ajax){
		_ajax.onreadystatechange=function(){
			if(_ajax.readyState==4 && _ajax.status==200){
				_fn(_ajax.responseText);
			}
		}
	}
	_ajax.open(_method,_url,_async);
	_ajax.setRequestHeader("content-type","application/x-www-form-urlencoded;charset=utf8")
	_ajax.send(_parameter);
}