(function(window){
	var data = {}; //全局缓存对象
	//强制转换为字符串对象
	function toStr(value){
		return (value || "") + "";
	}
	//遍历所有 cookie 放入内存中
	function getCookie(){
		data = {};
		var cookie = document.cookie.replace(/\s/ig,"");
		var keys = [];
		// 获取所有 key 值
		cookie.replace(/(^|;)([a-zA-Z0-9_-])*/ig, function(key){
			key && keys.push(toStr(key.replace(/^;/g,"")));
			return key;
		});
		//根据 可以 值匹配 value
		for(var i = 0,len = keys.length;i<len;i++){
			key = keys[i];
			var reg = new RegExp('(;|^)'+key+'=([^;].*?)(;|$)');
			var r = cookie.match(reg);
			var value = void 0;
			r && (value = r[2] && unescape(decodeURI(r[2])));

			data[key] = value || "";
		}
	}
	function Cookie(){
		getCookie();
		/**
		 * 根据 cookie 名字查询值
		 */
		this.get = function(key,status){
			if(status){
				getCookie();
			}
			if(this.has(key)){
				return data[toStr(key)];
			}else{
				return "";
			}
		};
		/**
		 * 判断 cookie 中是否存在这个 cookie
		 */
		this.has = function(key){
			return (key || key == 0) && toStr(key) in data;
		}
		/**
		 * 获取所有 cookie 的名字 以数组返回
		 */
		this.keys = function(){
			if(Object.keys){
				return Object.keys(data);
			}else{
				var keys = [];
				for(var key in data){
					keys.push(key);
				}
				return keys;
			}
		};
		/*
		 * [根据键名修改键值]
		 * 如果键名不存在则会添加新的键名
		 * @param {[tring]} key   [键名]
		 * @param {[type]}  value [键值]
		 * @param {[type]}  expires  指定Cookie过期时间
		 * @param {[type]}  path     路径
		 * @param {[type]}  domain   指定Cookie所在的域名
		 */
		this.set = function(key,value,expires,path,domain){
			var content = {};
			key = toStr(key); //强制转为 string 类型
			if(!key){
				return false; //如果 key 为空 就结束程序
			}
			value = (value && value != 0 ) ? value : "";
			content[key] = encodeURI(value || "");
			//没有传入过期时间, 默认为 Session
			if(!expires){
				if(!-[1,]){ // IE8/7/6 内核
					expires = "At the end of the Session";
				}else{
					expires = "Session";
				}
				//保存到内存中
				data[key] = value;
			}else{
				//如果传入的过期时间是整形,就在当前时间上做时间戳相加
				if(typeof expires != "number"){
					//默认为 保存 7 天时间
					expires = 1000*60*60*24*7;
				}
				if(expires > 0){
					//保存到内存中
					data[key] = value;
				}else{ //缓存时间为负数 证明是需要删除 cookie
					//从内存中删除 cookie
					delete data[key];
				}
				expires = new Date(new Date().getTime() + expires).toGMTString();
			}
			content["expires"] = expires;
			content["path"] = path || "/";
			if(domain){
				content["domain"] = domain;
			}
			var param = [];
			for(var key in content){
				param.push(key + "=" + content[key]);
			}
			document.cookie = param.join("; ");
			return this;
		};
		/**
		 * 删除 cookie
		 */
		this.remove = function(key){
			if(this.has(key)){
				//传入一个过期时间
				//删除cookie 就是设置一个过期时间
				this.set(key,null,1000*60*60*-1);
				return true;
			}else{
				return false;
			}
		};
	}
	var ck = new Cookie();
	//写入一个全局的函数
	window.setCookie = function(){
		return ck.set.apply(ck,arguments);
	}
	window.getCookie = function(){
		return ck.get.apply(ck,arguments);
	}
	window.cookies = ck;
	window.removeCookie = function(){
		return ck.remove.apply(ck,arguments);
	}
})(window);
