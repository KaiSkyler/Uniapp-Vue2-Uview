const toIndexFlush = '/pages/index/flush';
const toIndexHome = '/pages/index/home';

export default {
	// 跳转启动页
	toIndexFlush: () => {
		uni.navigateTo({
			url: toIndexFlush
		})
	},
	// 跳转首页
	toIndexHome: (mode, params) => {
		if (mode === 'reLaunch') {
			uni.reLaunch({
				url: toIndexHome + (params ? '?' + params : '')
			})
		} else {
			uni.switchTab({
				url: toIndexHome + (params ? '?' + params : '')
			})
		}
	},
}
