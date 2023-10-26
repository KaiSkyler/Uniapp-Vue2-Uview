import store from '@/store/index.js'
import conf from '@/config/common/constantConfig.js'
// 图片预览
function previewImageUrl(path) {
	return path.replace('.M.webp', '').replace('.S.webp', '').replace('.L.webp', '');
}

function previewImage(current, urls) {
	if (typeof current === 'number' && !urls || typeof current !== 'number' && !current) {
		return false;
	}
	uni.previewImage({
		// #ifdef APP-PLUS
		loop: true,
		// #endif
		current: previewImageUrl(typeof current === 'number' ? urls[current] : current), // 当前显示图片的http链接
		urls: (urls || [current]).map(item => {
			return previewImageUrl(item);
		}) // 需要预览的图片http链接列表
	})
}

// 加载上一个页面
function beforePage() {
	let pages = getCurrentPages(); //当前页
	if (pages.length > 1) {
		let beforePage = pages[pages.length - 2]; //上个页面
		// #ifdef H5
		return beforePage;
		// #endif
		// #ifndef H5
		return beforePage.$vm;
		// #endif
	} else {
		return false;
	}
}


function goto(url, type = 'navigateTo') {
	// if (tabBarUrls.findIndex(str => {
	// 		return url.indexOf(str) === 0;
	// 	}) > -1) {
	// 	uni.reLaunch({
	// 		url: url
	// 	})
	// } else {
	// 	if (type === 'redirectTo') {
	// 		uni.redirectTo({
	// 			url: url
	// 		})
	// 	} else {
	// 		uni.navigateTo({
	// 			url: url
	// 		})
	// 	}
	// }
	if (type === 'redirectTo') {
		uni.redirectTo({
			url: url
		})
	} else if (type === 'reLaunch') {
		uni.reLaunch({
			url: url
		})
	} else {
		uni.navigateTo({
			url: url
		})
	}
}

// 返回上一页
function goBack(delta = 1) {
	if (getCurrentPages().length > delta) {
		uni.navigateBack({
			delta: delta
		});
	} else {
		uni.reLaunch({
			url: '/pages/index/home'
		})
	}
}

// 显示消息提示框
function toast(obj, callback = {}) {
	uni.showToast(Object.assign({
		icon: 'none',
		duration: 2000,
		mask: false,
		success: callback.success && callback.success(),
		fail: callback.fail && callback.fail(),
		complete: function() {
			setTimeout(function() {
				uni.hideToast();
				callback.complete && callback.complete();
			}, 2000);
		}
	}, obj))
}

// 加载中
function loading(obj) {
	uni.showLoading(Object.assign({
		mask: false
	}, obj))
}

// 打电话
function tel(phoneNumber) {
	uni.makePhoneCall({
		phoneNumber
	})
}

// 页面滚动
function scrollTo(top = 0, duration = 300) {
	uni.pageScrollTo({
		scrollTop: top,
		duration: duration
	});
}

// 打开地图
function openLocation(obj) {
	obj.latitude = Number(obj.latitude);
	obj.longitude = Number(obj.longitude);
	if (obj.latitude && obj.longitude) {
		uni.openLocation(Object.assign({
			scale: 12
		}, obj));
	} else {
		toast({
			title: '经纬度异常'
		})
	}
}

function copy(str) {
	uni.setClipboardData({
		data: str,
		success: function() {
			toast({
				icon: 'success',
				title: '复制成功'
			});
		}
	});
}
// 退出提示
function enableAlertBeforeUnload(msg = '信息已修改并未保存，是否退出?') {
	// #ifdef MP-WEIXIN
	wx.enableAlertBeforeUnload({
		message: msg
	});
	// #endif
}
// 取消退出提示
function disableAlertBeforeUnload() {
	// #ifdef MP-WEIXIN
	wx.disableAlertBeforeUnload();
	// #endif
}
// 微信客服
function openCustomerServiceChat() {
	wx.openCustomerServiceChat({
		extInfo: {
			url: conf.KF_URL
		},
		corpId: conf.kf_corpId,
		success(res) {},
		fail(err) {
			console.log('err', err)
		}
	})
}
// 获取图片信息
function getImageInfo(url) {
	if (url) {
		return new Promise((resolve, reject) => {
			uni.getImageInfo({
				src: url,
				success: resolve,
				fail: reject,
			})
		})
	}
}
// 获取文件信息
function getFileInfo(url) {
	if (url) {
		return new Promise((resolve, reject) => {
			uni.getFileInfo({
				filePath: url,
				success: resolve,
				fail: reject,
			});
		})
	}
}

// 语音播放
let innerAudioContext = null;

function playAudio(src, obj = {}) {
	if (src) {
		innerAudioContext && innerAudioContext.destroy()
		innerAudioContext = uni.createInnerAudioContext()
		innerAudioContext.src = src;
		innerAudioContext.play()
		innerAudioContext.onPlay(() => {
			console.log('开始播放')
			obj.onPlay && obj.onPlay()
		})
		innerAudioContext.onEnded(() => {
			console.log('播放结束')
			obj.onEnded && obj.onEnded();
			stopAudio();
		})
		innerAudioContext.onError((res) => {
			toast({
				title: '语音失败:' + (res.errMsg || '未知')
			})
			obj.onError && obj.onError();
			stopAudio()
		})
	}
}

function stopAudio() {
	if (innerAudioContext) {
		innerAudioContext.destroy(); // 销毁组件
		innerAudioContext = null;
	}
}

module.exports = {
	previewImage, // 预览图片
	beforePage, // 加载上一个页面
	goto, // 跳转
	goBack, // 返回
	toast,
	loading,
	scrollTo,
	tel, // 拨打电话
	openLocation,
	copy,
	enableAlertBeforeUnload,
	disableAlertBeforeUnload,

	openCustomerServiceChat, // 微信客服

	getImageInfo, // 获取图片信息
	getFileInfo, // 获取文件信息

	playAudio, // 播放语音
	stopAudio, // 停止播放
}
