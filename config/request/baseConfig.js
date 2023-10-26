import {
	optionsUrl
} from "@/config/common/baseUrlConfig";

// 此vm参数为页面的实例，可以通过它引用vuex中的变量
module.exports = (vm) => {
	let log = {}
	// 初始化请求配置
	uni.$u.http.setConfig((config) => {
		/* config 为默认全局配置*/
		config.baseURL = optionsUrl.isDebug ? optionsUrl.devUrl : optionsUrl.prodUrl; /* 根域名 */
		config.header = {
			//'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
			'content-type': config.custom.contentType || 'application/json'
		};
		config.timeout = 60000;

		return config
	})

	// 请求拦截
	uni.$u.http.interceptors.request.use(async (config) => { // 可使用async await 做异步操作
		// console.log('请求拦截',config)
		log.request = config
		config.header['content-type'] = config.custom.contentType || 'application/json';
		// 初始化请求拦截器时，会执行此方法，此时data为undefined，赋予默认{}
		config.data = config.data || {}
		// 根据custom参数中配置的是否需要token，添加对应的请求头
		if (config?.custom?.auth) {
			// 可以在此通过vm引用vuex中的变量，具体值在vm.$store.state中
			let authorization = vm.$store.state.user.authorization;
			let key = 'X-Access-Token';
			config.header[key] = authorization.token
			// if (authorization && authorization.token && authorization.expires > new Date().getTime()) { // token存在并且过时
			// 	config.header.token = authorization.token
			// } else { // 否则，取消本次请求
			// 	let res = await vm.$store.dispatch('user/refreshToken') // 先刷新token试试，失败则：1、清空 数据&缓存，2、跳转到登录页面
			// 	if (res === false) {
			// 		return Promise.reject(config) //阻止进一步请求操作
			// 	}
			// }
		}

		return config
	}, config => { // 可使用async await 做异步操作
		return Promise.reject(config)
	})

	// 响应拦截
	uni.$u.http.interceptors.response.use((response) => {
		log.response = response
		console.log('响应拦截',log)
		/* 对响应成功做点什么 可使用async await 做异步操作*/
		const data = response.data

		// 自定义参数
		const custom = response.config?.custom

		if(data.error_code == 200) {
			return data.results === undefined ? {} : data.results
		}

		if (data.code !== 200) {
			// 如果没有显式定义custom的toast参数为false的话，默认对报错进行toast弹出提示
			if (custom.toast !== false) {
				uni.$u.toast(data.message)
			}

			// if (+data.code === 401) { // code：401, 表登录失效
			// 	console.log('登陆失效')
			// 	vm.$store.dispatch('user/loginOut') // 清空 数据&缓存
			// 	vm.$routerConfig.indexRouter.toLogin(); // 跳转到登录页面
			// }

			// 如果需要catch返回，则进行reject
			if (custom?.catch) {
				return Promise.reject(data)
			} else {
				// 否则返回一个pending中的promise，请求不会进入catch中
				return new Promise(() => {})
			}
		}
		return data.result === undefined ? {} : data.result
	}, (response) => {
		const data = response.data
		if (+data.code === 401) { // code：401, 表登录失效
			console.log('登陆失效')
			uni.$u.toast('登陆失效')
			vm.$store.dispatch('user/loginOut') // 清空 数据&缓存
			vm.$routerConfig.indexRouter.toLogin(); // 跳转到登录页面
		}else{
			uni.$u.toast('接口请求失败：'+data.message)
		}
		// 对响应错误做点什么 （statusCode !== 200）
		return Promise.reject(response)
	})
}
