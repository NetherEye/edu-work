/* 全局变量 */
import Vue from 'vue'
var _global = {
	cancelHttp: [], // 标记的请求集合
	needLoadingRequestCount: [], // 请求次数 合并请求loading
}

Vue.prototype._global = _global;