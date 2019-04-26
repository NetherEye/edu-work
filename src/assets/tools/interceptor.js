/**
 * http配置
 */
// 引入axios以及element ui中的loading和message组件
import axios from 'axios'
import { Message } from 'element-ui'
import Vue from 'vue';
import '@/assets/tools/global'

// 超时时间
axios.defaults.timeout = 100000;

const CancelToken = axios.CancelToken;
/* 当config.options 不为null时显示loading */
/* Vue.prototype._global.needLoadingRequestCount 为loading集合 元素为对象ops
 * ops.target loading dom，也是通过其合并loading
 * ops.count 合并次数
 * ops.loading 产生的loading实例
 * */

axios.interceptors.request.use(config => {
	
	// 解决这个三个请求不能多个的问题
	if(config.url === '/proxy/api/poorpeople/list' || config.url === '/proxy/api/poorpeople/list/meAssist' || config.url === '/proxy/api/poorpeople/list/meReport'){
		for (var i = 0, len = Vue.prototype._global.cancelHttp.length; i < len; i++) {
			if(Vue.prototype._global.cancelHttp[i].url === config.url && Vue.prototype._global.cancelHttp[i].method === config.method){
				Vue.prototype._global.cancelHttp[i].cancelToken('中断请求'); //执行取消操作
				Vue.prototype._global.cancelHttp.splice(i, 1);
				
				Vue.prototype._global.needLoadingRequestCount.forEach((a, i) => {
					if(a.target == config.options.target) {
						a.loading.close();
						Vue.prototype._global.needLoadingRequestCount.splice(i, 1)
						return
						
					}
				})
				break;
			}
		}
	}
	// 上面为解决扶贫信息页数过大时查询时间长，而用户手动切换页数 时中断上次请求
	
	// 添加cacel标记
	config.cancelToken = new CancelToken(c => {  //强行中断请求要用到的
    	// 装填正在请求的请求
		Vue.prototype._global.cancelHttp.push({
			url: config.url,
			method: config.method,
			cancelToken:c
		})
  	});
  	
  	// 解决这两个请求不能共存
  	if(config.url === '/proxy/api/poorpeople/list/meAssist' || config.url === '/proxy/api/poorpeople/list/meReport'){
		var falg = 0;
		var a = null, b = null;
		for (var i = 0, len = Vue.prototype._global.cancelHttp.length; i < len; i++) {
			if(Vue.prototype._global.cancelHttp[i].url === '/proxy/api/poorpeople/list/meAssist'){
				falg++;
				a = i
			}
			if(Vue.prototype._global.cancelHttp[i].url === '/proxy/api/poorpeople/list/meReport'){
				falg++;
				b = i
			}
		}
		if(falg === 2){
			if(config.url === '/proxy/api/poorpeople/list/meAssist'){
				Vue.prototype._global.cancelHttp[b].cancelToken('中断请求'); //执行取消操作
				Vue.prototype._global.cancelHttp.splice(b, 1);
				
				Vue.prototype._global.needLoadingRequestCount.forEach((a, i) => {
					if(a.target == config.options.target) {
						a.loading.close();
						Vue.prototype._global.needLoadingRequestCount.splice(i, 1)
						return
						
					}
				})
			}else if(config.url === '/proxy/api/poorpeople/list/meReport'){
				Vue.prototype._global.cancelHttp[a].cancelToken('中断请求'); //执行取消操作
				Vue.prototype._global.cancelHttp.splice(a, 1);
				
				Vue.prototype._global.needLoadingRequestCount.forEach((a, i) => {
					if(a.target == config.options.target) {
						a.loading.close();
						Vue.prototype._global.needLoadingRequestCount.splice(i, 1)
						return
						
					}
				})
			}
		}
	}
  	
  	
  	
	if(config.options != null){ // 此处显示loading
		config.options.loadingText = config.options.loadingText || '拼命加载中...';
		config.options.target = config.options.target || 'document.body';
		var _background = "rgba(0, 0, 0, 0.8)";
		if(config.options.target != 'document.body'){
			_background = "#fff";
		}
		
		var flag = false;
		Vue.prototype._global.needLoadingRequestCount.forEach(a => {
			if(a.target == config.options.target){
				a.count++;
				flag = true;
			}
		})
		if(!flag){
			let obj = {
				target: config.options.target,
				count: 0, 
				loading: null,
			}
			obj.loading = Vue.prototype.$loading({
				target: config.options.target,
				fullscreen: true,
				text: config.options.loadingText,
				background: _background,
			})
			Vue.prototype._global.needLoadingRequestCount.push(obj)
		}
	}
	
	return config
	
}, error => {
	if(error.config.options != null){
		endLoading(error.config)
	}
	Message.error({
		message: '请求错误',
		duration:'1000'
	})
	
	return Promise.reject(error)
})
// http响应拦截器
axios.interceptors.response.use(data => { // 响应成功关闭loading
	if(data.config.options != null){
		endLoading(data.config)
	}
	return data
}, error => {
	if(error.config.options != null){
		endLoading(error.config)
	}
	
	if(error.request.readyState == 4 && error.request.status == 0){
		if(axios.isCancel(error)){
			// 此处为切换路由中断上次请求的地方
		}else{
			Message.error({
				message: '请求超时',
			})
			
			error.response = {
				code: 201,
				message: '请求超时'
			}
			return Promise.reject(error)
			
		}
		
	}
	
	if(error.response.status === 400){
		Message.error({
			message: '错误请求',
		})
		
	}else if(error.response.status === 500){
		Message.error({
			message: '服务器端出错',
		})	
		
	}else{
		Message.error({
			message: error.response.status,
		})
	}
	return Promise.reject(error)
})

function endLoading(config) {
	Vue.prototype._global.needLoadingRequestCount.forEach((a, i) => {
		if(a.target == config.options.target){
			if(a.count < 0){
				a.count = 0
			}
			if(a.count == 0){
				a.loading.close();
				Vue.prototype._global.needLoadingRequestCount.splice(i, 1)
			}else{
				a.count--;
			}
		}
	})
};
function clearLoading(){
	Vue.prototype._global.needLoadingRequestCount.forEach((a, i) => {
		a.loading.close();
	})
	Vue.prototype._global.needLoadingRequestCount = [];
}

function cancelHttp(config){ /* 由于后天一样接口需要同时请求，参数不同而已，该操作gg  */
    for(let p in Vue.prototype._global.cancelHttp){
        if(Vue.prototype._global.cancelHttp[p].url === config.url && Vue.prototype._global.cancelHttp[p].method === config.method) { //当当前请求在数组中存在时执行函数体
            Vue.prototype._global.cancelHttp[p].cancelToken('中断请求'); //执行取消操作
            Vue.prototype._global.cancelHttp.splice(p, 1);
        }
    }
}

export default axios