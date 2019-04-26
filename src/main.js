import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './assets/css/public.css'; // 重置样式

import iView from 'iview';
import 'iview/dist/styles/iview.css';

import Fetch from '@/assets/tools/fetch'
import allApi from '@/assets/api/test'

Vue.use(iView);

Vue.config.productionTip = false


//拦截，没有登录的时候  退回登录页
router.beforeEach((to, from, next) => {

	if (to.name === '被迫下线') {
		next()
		return
	}

	Fetch.get(allApi.isLogin, '', res => {
		if (res.code === 201) {
			window.location.href = res.data
		} else if (res.code === 403) { // 该角色没登录该系统的权限
			Vue.prototype.$Message.info(res.message)
			setTimeout(() => {
				Fetch.get(allApi.logout, '', res => {
					localStorage.clear()
					sessionStorage.clear()
					window.location.href = res
				})

			}, 1500)
			return
		} else {
			if (localStorage.getItem('userInfo')) {
				// 权限判断
				if (localStorage.getItem('userInfo')) {
					let aaa = JSON.parse(localStorage.getItem('userInfo'))
					if (to.meta.indexOf(aaa.role) === -1) {
						alert('权限失败')
						next()
					} else {
						next()
					}
				}


			} else {
				let nextName = res.data.role === '学校' ? '场地管理' : '用车申请'
				localStorage.setItem('userInfo', JSON.stringify(res.data))
				next({
					name: nextName
				})

			}

		}
	})




	next()


});

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')