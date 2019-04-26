import Vue from 'vue'
import Router from 'vue-router'
import Home from './components/Home.vue'
import hundred from './components/201.vue'

Vue.use(Router)

export default new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [{
			path: '/',
			name: 'home',
			component: Home,
			meta: ['学校', '教师'],
		},
		{
			path: '/201',
			name: '被迫下线',
			component: hundred,
			meta: ['学校', '教师'],
		},
		{
			path: '/school',
			name: '学校端',
			component: Home,
			children: [{
					path: 'grade',
					name: '成绩管理',
					meta: ['教师'],
					component: () => import('./views/school/eduAdministration/grade.vue')
				},
				{

					path: 'site',
					name: '场地管理',
					meta: ['学校'],
					component: () => import('./views/school/officeManagement/site.vue')
				},
				{
					path: 'repairs',
					name: '报修管理',
					meta: ['学校'],
					component: () => import('./views/school/officeManagement/repairs.vue')
				}
			]
		},
		{
			path: '/teacher',
			name: '教师端',
			component: Home,
			children: [{
					path: 'leave',
					name: '请假审批',
					meta: ['教师'],
					component: () => import('./views/teacher/eduAdministration/leave.vue')
				},
				{
					path: 'useCar',
					name: '用车申请',
					meta: ['教师'],
					component: () => import('./views/teacher/officeManagement/useCar.vue')
				},
				{
					path: 'useCarApproval',
					name: '用车审批',
					meta: ['教师'],
					component: () => import('./views/teacher/officeManagement/useCarApproval.vue')
				},
				{
					path: 'siteBooking',
					name: '场地预约',
					meta: ['教师'],
					component: () => import('./views/teacher/officeManagement/siteBooking.vue')
				},
				{
					path: 'eqRepairs',
					name: '设备报修',
					meta: ['教师'],
					component: () => import('./views/teacher/officeManagement/eqRepairs.vue')
				},
			]
		}
	]
})