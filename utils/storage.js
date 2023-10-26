import {
	isJSON
} from '@/utils/utils.js';
export const getItem = (name, mode = 'sync') => {
	// 默认同步，不要异步
	// if (mode = 'sync') {
	const data = uni.getStorageSync(name)
	try {
		return data && isJSON(data) ? JSON.parse(data) : data
	} catch (err) {
		return data
	}
	// }else{
	// 	uni.getStorageSync('name')
	// }
}
// mode:sync 同步 或 async 异步, 默认异步
export const setItem = (name, value, mode = 'async') => {
	if (typeof value === 'object') {
		value = JSON.stringify(value)
	}
	if (mode === 'sync') { // 同步
		uni.setStorageSync(name, value)
	} else { // 异步
		uni.setStorage({
			key: name,
			data: value
		});
	}
}
// mode:sync 同步 或 async 异步, 默认异步
export const removeItem = (name, mode = 'async') => {
	if (mode === 'sync') {
		uni.removeStorageSync(name);
	} else {
		uni.removeStorage({
			key: name,
		});
	}
}
// mode:sync 同步 或 async 异步, 默认异步
export const clear = (mode = 'async') => {
	if (mode === 'sync') {
		uni.clearStorageSync();
	} else {
		uni.clearStorage();
	}
}
