import axios from '@/assets/tools/interceptor'
import qs from 'qs'
import Vue from 'vue'
import router from '@/router'

//axios.defaults.withCredentials = true

import {
	Loading,
	Message
} from 'element-ui'

/* loading说明
 * (url, par, callback, optipns)
 * parmas options 传入空对象 默认全屏loading
 * options.loadingText 加载文字
 * options.noToken http不携带token
 * options.target loading覆盖DOM .target or #target document.query...
 * 
 *  */


class Fetch {
	//表单序列化
	packageParamBase(param) {
		let _param = param || {}
		let _requestParam = param
		return qs.stringify(_requestParam)
	}

	// 退出
	logout(_this) {
		_this.$confirm('此操作将返回登录页面, 是否继续?', '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning'
		}).then(() => {
			localStorage.clear();
			sessionStorage.clear();
			_this.$router.replace({
				name: '登录'
			})
		}).catch(() => {

		});
	}

	//获取token值
	getToken() {
		let token = localStorage.getItem('token')
		if (token) {
			token = token
		} else {
			token = ""
		}
		return token
	}
	// post
	post(url, data, callback, options) {
		let _requestParam = this.packageParamBase(data);

		options = options || null;
		if (options != null && options.noToken) {
			var _headers = {
				'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
			}
		} else {
			var _headers = {
				'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
				'token': this.getToken()
			}
		}
		axios({
				method: 'post',
				url: url,
				data: _requestParam,
				headers: _headers,
				options: options,
			})
			.then(function (response) {
				checkStatusAndCode(response, callback);
			})
			.catch(function (error) {
				if (axios.isCancel(error)) {
					// 此处为切换路由中断上次请求的地方
					return
				}
				if (error && error.response) {
					callback(error.response)
				}
			})
	}
	post1(url, data, callback, options) {
		let _requestParam = data;

		options = options || null;
		if (options != null && options.noToken) {
			var _headers = {
				'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
			}
		} else {
			var _headers = {
				'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
				'token': this.getToken()
			}
		}
		axios({
				method: 'post',
				url: url,
				data: _requestParam,
				headers: _headers,
				options: options,
			})
			.then(function (response) {
				checkStatusAndCode(response, callback);
			})
			.catch(function (error) {
				if (axios.isCancel(error)) {
					// 此处为切换路由中断上次请求的地方
					return
				}
				if (error && error.response) {
					callback(error.response)
				}
			})
	}

	// get
	get(url, data, callback, options) {
		let _requestParam = this.packageParamBase(data);

		options = options || null;
		if (options != null && options.noToken) {
			var _headers = {
				'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
			}
		} else {
			var _headers = {
				'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
				'token': this.getToken()
			}
		}
		axios({
				method: 'get',
				url: url,
				params: data,
				headers: _headers,
				options: options,
			})
			.then(function (response) {
				checkStatusAndCode(response, callback);
			})
			.catch(function (error) {
				if (error && error.response) {
					callback(error.response)
				}
			})
	}

	// file
	file(par, file, progressCallback, callback) {
		let param = new FormData(); //创建form对象
		param.append('key', par.key); //添加form表单中其他数据
		param.append('policy', par.policy); //添加form表单中其他数据
		param.append('OSSAccessKeyId', par.accessId); //添加form表单中其他数据
		param.append('success_action_status', '200'); //添加form表单中其他数据
		param.append('signature', par.signature); //添加form表单中其他数据
		param.append('file', file); //通过append向form对象添加数据
		var _headers = {
			'Content-Type': 'multipart/form-data'
		}
		axios({
				method: 'post',
				url: par.host,
				data: param,
				headers: _headers,
				timeout: 7200000,
				onUploadProgress: function (progressEvent) { // 原生获取上传进度的事件
					if (progressEvent.lengthComputable) {
						progressCallback(progressEvent);
					}
				},
			})
			.then(function (response) {
				callback(response);
			})
			.catch(function (error) {
				if (axios.isCancel(error)) {
					// 此处为切换路由中断上次请求的地方
					return
				}
				if (error && error.response) {
					callback(error.response)
				}
			})
	}

	// import
	importE(url, file, progressCallback, callback) {
		let param = new FormData(); //创建form对象

		param.append('file', file); //通过append向form对象添加数据
		var _headers = {
			'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
			'token': this.getToken()
		}
		axios({
				method: 'post',
				url: url,
				data: param,
				headers: _headers,
				timeout: 7200000,
				onUploadProgress: function (progressEvent) { // 原生获取上传进度的事件
					if (progressEvent.lengthComputable) {
						progressCallback(progressEvent);
					}
				},
			})
			.then(function (response) {
				callback(response);
			})
			.catch(function (error) {
				if (axios.isCancel(error)) {
					// 此处为切换路由中断上次请求的地方
					return
				}
				if (error && error.response) {
					callback(error.response)
				}
			})
	}

	// put
	put(url, data, callback, options) {
		let _requestParam = this.packageParamBase(data);

		options = options || null;
		if (options != null && options.noToken) {
			var _headers = {
				'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
			}
		} else {
			var _headers = {
				'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
				'token': this.getToken()
			}
		}
		axios({
				method: 'put',
				url: url,
				data: _requestParam,
				headers: _headers,
				options: options
			})
			.then(function (response) {
				checkStatusAndCode(response, callback);
			})
			.catch(function (error) {
				if (axios.isCancel(error)) {
					// 此处为切换路由中断上次请求的地方
					return
				}
				if (error && error.response) {
					callback(error.response)
				}
			})
	}

	// delete
	delete(url, data, callback, options) {
		let _requestParam = this.packageParamBase(data);

		options = options || null;
		if (options != null && options.noToken) {
			var _headers = {
				'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
			}
		} else {
			var _headers = {
				'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
				'token': this.getToken()
			}
		}
		axios({
				method: 'delete',
				url: url,
				params: data,
				headers: _headers,
				options: options
			})
			.then(function (response) {
				checkStatusAndCode(response, callback);
			})
			.catch(function (error) {
				if (axios.isCancel(error)) {
					// 此处为切换路由中断上次请求的地方
					return
				}
				if (error && error.response) {
					callback(error.response)
				}
			})
	}



	// export
	export (url, data, callback, options) {
		let _requestParam = this.packageParamBase(data);

		options = options || null;
		if (options != null && options.noToken) {
			var _headers = {
				'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
			}
		} else {
			var _headers = {
				'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
				'token': this.getToken()
			}
		}
		axios({
				method: 'get',
				url: url,
				params: data,
				headers: _headers,
				responseType: 'blob',
				options: options
			})
			.then(function (response) {
				checkStatusAndCode(response, callback, 'export');
			})
			.catch(function (error) {
				if (axios.isCancel(error)) {
					// 此处为切换路由中断上次请求的地方
					return
				}
				if (error && error.response) {
					callback(error.response)
				}
			})
	}

}


function checkStatusAndCode(response, callback, type) {
	if (type == 'export') {
		if (response.status != 200) {
			return callback({ // 导出失败
				code: '404',
				message: '导出失败'
			})
		}
		var blob = new Blob([response.data], { // 构建类型
			type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
		});
		var href = window.URL.createObjectURL(blob); // 生成下载的链接
		return callback({
			code: 200,
			href: href,
			data: response.data
		})
	}

	if (response && ((response.status === 200 || response.status === 304 || response.status === 400))) {
		if (response.data.code == 211) { // 跳转201页面
			localStorage.clear();
			sessionStorage.clear()
			router.replace({
				name: '被迫下线'
			})
		}

		if (response.data.code != 200) { // 后台自定义状态码非200时将message提醒给用户
			Message({
				type: 'warning',
				message: response.data.message
			})
		}
		if (response.data.code == 601) {
			localStorage.clear();
			window.location = response.data.data
		}
		if (response.data.code == 401) {
			Message({
				type: 'warning',
				message: response.data.message
			})
			localStorage.clear();
			router.replace({
				name: '登录'
			})
		}
		if (response.data.code == 405) {

			Message({
				type: 'warning',
				message: response.data.message
			})
			localStorage.clear();
			router.replace({
				name: '登录'
			})
		}
		return callback(response.data)
	}
}

export default new Fetch()