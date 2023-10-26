import {
	BigNumber
} from '@/utils/bignumber.js';

// 高精度：多个数 加法
export function add(...params) {
	let data = BigNumber(0);
	for (let index = 0; index < params.length; index++) {
		const element = BigNumber(params[index]);
		data = data.plus(element);
	}
	return data.toNumber();
}
// 高精度：多个数 减法
export function minus(...params) {
	let data = BigNumber(params[0]);
	for (let index = 1; index < params.length; index++) {
		const element = BigNumber(params[index]);
		data = data.minus(element);
	}
	return data.toNumber();
}
// 高精度：多个数 乘法
export function mutiply(...params) {
	let data = BigNumber(params[0]);
	for (let index = 1; index < params.length; index++) {
		const element = BigNumber(params[index]);
		data = data.multipliedBy(element);
	}
	return data.toNumber();
}
// 高精度：多个数 除法
export function devide(...params) {
	let data = BigNumber(params[0]);
	for (let index = 1; index < params.length; index++) {
		const element = BigNumber(params[index]);
		data = data.dividedBy(element);
	}
	return data.toNumber();
}

// 小数点处理
export function toFloat(val, digt) {
	let n = digt || 2
	val = parseFloat(val) || 0
	let m = Math.pow(10, n)
	return Math.round(val * m) / m
}
export function formatInputNum(str, digt = 2) {
	str = str.toString();
	// 清除"数字"和"."以外的字符
	str = str.replace(/[^\d.]/g, '');
	// 验证第一个字符是数字
	// str = str.replace(/^\./g, '');
	// 只保留第一个,清除多作的
	str = str.replace(/\.{2,}/g, '.');
	str = str.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
	if (str === '.') {
		str = '0.'
	} else if (str.indexOf('0.') !== 0) {
		// 最后一个字符不是'.'或不是 '.0+' 
		str = str.replace(/^\b(0+)/gi, "0");
	}
	if (str !== '0' && str.indexOf('0.') !== 0) {
		str = str.replace(/^\b(0+)/gi, "");
	}
	// 只能输入两个小数
	if (digt === 2) {
		str = str.replace(/^(-*)(\d+)\.(\d{2}).*$/, '$1$2.$3')
	} else {
		str = str.replace(/^(-*)(\d+)\.(\d+).*$/, '$1$2.$3')
	}

	return str;
}
//日期字符串转成时间戳
export function dateStr2TimeTamp(dateStr) {
	dateStr = (dateStr || '').toString().substring(0, 19);
	dateStr = dateStr.replace(/-/g, '/');
	return new Date(dateStr).getTime();
}
// 移除左右两边空格
export function trim(str) {
	return str.replace(/^\s+|\s+$/gm, '')
}
// 比较两个对象是相等
export function isDeepEqual(obj1, obj2, testPrototypes = false) {
	if (obj1 === obj2) {
		return true
	}
	if (typeof obj1 === 'function' && typeof obj2 === 'function') {
		return obj1.toString() === obj2.toString()
	}
	if (obj1 instanceof Date && obj2 instanceof Date) {
		return obj1.getTime() === obj2.getTime()
	}
	if (Object.prototype.toString.call(obj1) !== Object.prototype.toString.call(obj2) && typeof obj1 !== 'object') {
		return false
	}
	const newB = testPrototypes ? isDeepEqual(Object.getPrototypeOf(obj1), Object.getPrototypeOf(obj2), true) : true
	const obj1Props = Object.getOwnPropertyNames(obj1)
	const obj2Props = Object.getOwnPropertyNames(obj2)
	return (
		obj1Props.length === obj2Props.length && newB && obj1Props.every(item => isDeepEqual(obj1[item], obj2[
			item]))
	)
}
// 解析URL
export function parseURL(url) {
	const search = decodeURIComponent(url).split('?')[1].replace(/\+/g, ' ')
	if (!search) {
		return {}
	}
	const obj = {}
	const searchArr = search.split('&')
	searchArr.forEach(v => {
		const index = v.indexOf('=')
		if (index !== -1) {
			const name = v.substring(0, index)
			const val = v.substring(index + 1, v.length)
			obj[name] = val
		}
	})
	return obj
}
// 字符串是否为JSON格式
export function isJSON(str) {
	if (typeof str == 'string') {
		try {
			var obj = JSON.parse(str);
			if (typeof obj == 'object' && obj) {
				return true;
			} else {
				return false;
			}

		} catch (e) {
			return false;
		}
	}
}
// 验证文件格式（图片丶视频）
export function checkFile(fileValue, type) {	
	let fileValueSuffix = fileValue.split('?')[0].substring(fileValue.lastIndexOf(".")); //截断"."之前的，得到后缀
	if (type === 'video') {
		if (!/(.*)\.(mp4|mpg|mpeg|dat|asf|avi|rm|rmvb|mov|wmv|flv|mkv|m3u8)$/.test(fileValueSuffix)) { //根据后缀，判断是否符合视频格式
			return false;
		}
	}
	if (type === 'image') {
		if (!/(.*)\.(jpeg|jpg|gif|png|svg|webp|jfif|bmp|dpg)$/.test(fileValueSuffix)) { //根据后缀，判断是否符合图片格式
			return false;
		}
	}

	return true;
}
