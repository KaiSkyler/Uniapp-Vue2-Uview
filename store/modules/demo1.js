//演示使用
import {
	getItem,
	setItem,
	removeItem
} from '@/utils/storage' //getItem和setItem是封装的操作localStorage的方法
import Vue from 'vue'
import $api from '@/config/request/index.js'
import $router from '@/config/router/index.js'
import $store from '@/store/index.js'

const TOKEN = 'token'
//用户信息状态管理
const state = {
	authorization: getItem(TOKEN) || {
		//登录token
		token: '',
		//刷新token
		refreshToken: '',
		//token过期时间
		expires: 0,
	},
	userInfo: getItem('userInfo') || {}, // 用户基本信息
	//当前模式 编辑模式1 浏览模式2 默认2
	currentModel: 2,
	//当前用户在当前访问公司中的角色信息
	roleInfo: getItem('roleInfo') || {
		roleName: '游客',
		roleId: 0
	},
}

const getters = {
	// 获取角色ID
	getRoleID: (state) => {
		return +state.roleInfo['roleId'] || 0
	},
	hasLogin: (state)=> {
		return state.authorization && state.authorization.token && state.authorization.expires > new Date().getTime() ? true : false
	},
	/**
	 * 判断是否有权限
	 * 0游客 1拥有者 2管理员 3销售员
	 */
	isRule: (state, getters) => fun => {
		let res = []
		if (getters.getRoleID) {
			switch (fun) {
				case 'prodEdit': // 商品详情=》商品编辑
					res = [1, 2]
					break
				case 'dirFun': // 用户中心=》所有目录功能
					res = [1, 2]
					break
				case 'memberList': // 用户中心=》管理功能=》成员管理
					res = [1, 2]
					break;
				default:
					break
			}
			return res.includes(getters.getRoleID)
		}
		return false
	},
}

const mutations = {
	setToken(state, data) {
		state.authorization = data
		setItem(TOKEN, data)
	},
	clearToken(state) {
		state.authorization = ''
		removeItem(TOKEN)
	},
	// 保存用户信息
	setUserInfo(state, data) {
		state.userInfo = data
		setItem('userInfo', data)
	},
	// 清除用户信息
	clearUserInfo(state) {
		state.userInfo = {}
		removeItem('userInfo')
	},
	//改变当前模式
	changeCurrentModel(state, val) {
		state.currentModel = val;
	},
	// 保存角色信息
	setRoleInfo(state, data) {
		state.roleInfo = data
		setItem('roleInfo', data)
	},
	// 清除角色信息
	clearRoleInfo(state) {
		state.roleInfo = {
			roleName: '游客',
			roleId: 0
		}
		removeItem('roleInfo')
	},
}

const actions = {
	// 退出登录
	clearToken({
		commit
	}) {
		// 清除token
		commit('clearToken')
		commit('clearRoleInfo')// 清除角色信息
		commit('clearUserInfo')// 清除用户信息
		// 清除当前公司ID
		commit('company/clearCompID', '', {
			root: true
		})
		// 清空行业
		commit('company/clearIndustry', '', {
			root: true
		})
	},
	async login({
		commit,
		dispatch
	}, data) {
		commit('setToken', {
			token: data.token,
			refreshToken: data.refreshToken,
			expires: data.expires
		})
		commit('setUserInfo', data.userInfo)
		commit('company/setCompList', data.companies, {
			root: true
		})

		let page = Vue.prototype.$startupPage
		if (page && page['path'] === 'commpages/pages/company/member/invite') {
			$router.companyRouter.toMemeberInvite('?' + Object.keys(page['query'])
				.map(function(key) {
					return key + "=" + page['query'][key];
				}).join("&"))
			return true;
		}
		if (!data['ignore']) {
			if (data.companies.length === 0) { // 还没有公司，引导创建公司
				$router.companyRouter.toCompanyGuideIndex('reLaunch')
			} else if (data.companies.length === 1) { // 只有一个公司，直接进入首页
				await dispatch('company/setCompID', {
					compID: data.companies[0]['CompID']
				}, {
					root: true
				})
			} else { // 进入选择公司
				$router.companyRouter.toSelectCompany('reLaunch')
			}
		}
	},
	// 刷新Token
	async refreshToken({
		commit,
		state,
		dispatch
	}) {
		if (state.authorization.refreshToken) {
			try {
				let res = await $api.userApi.refreshToken({
					refreshToken: state.authorization.refreshToken
				});
				commit('setToken', {
					token: res.token,
					refreshToken: res.refreshToken,
					expires: res.expires
				})
				commit('setUserInfo', res.userInfo)
				commit('company/setCompList', res.companies, {
					root: true
				})
				return true;
			} catch (e) {
				dispatch('clearToken') // 清空 数据&缓存
				$router.userRouter.toLoginIndex(); // 跳转到登录页面
				return false;
			}
		} else {
			dispatch('clearToken') // 清空 数据&缓存
			$router.userRouter.toLoginIndex(); // 跳转到登录页面
			return false;
		}
	},
	//获取当前用户在当前访问公司中的角色信息
	async getUserRoleInfo({
		state,
		commit,
	}) {
		//有登录的情况进行角色信息判断
		if (state.userInfo.UserID) {
			try {
				let roleInfo = '';
				let isMember = await $api.companyApi.checkMember({
					compID: $store.state.company.compID || '',
					userID: state.userInfo.UserID,
				});

				roleInfo = isMember ? roleInfo : {
					roleName: '游客',
					roleId: '0'
				};

				if (!isMember) {
					commit('setRoleInfo', roleInfo)
					return roleInfo;
				}
				let res = await $api.companyApi.getMemberRole({
					compID: $store.state.company.compID || '',
				})
				switch (res) {
					case "1":
						roleInfo = {
							roleName: '拥有者',
							roleId: parseInt(res)
						};
						break;
					case "2":
						roleInfo = {
							roleName: '管理员',
							roleId: parseInt(res)
						};
						break;
					case "3":
						roleInfo = {
							roleName: '销售员',
							roleId: parseInt(res)
						};
						break;
				}
				commit('setRoleInfo', roleInfo)
				return roleInfo;
			} catch (e) {
				console.log('user.js error', e)
				return false;
			}
		}
		//没有登录的情况，默认就是游客角色
		else {
			let roleInfo = {
				roleName: '游客',
				roleId: '0'
			}
			commit('setRoleInfo', roleInfo)
			return false;
		}
	}
}

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions
}
