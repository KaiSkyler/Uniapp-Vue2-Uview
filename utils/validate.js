// hrx:校验文件（20221128都取消）
/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isPhone(str) {
	// var reg = /^1[3|4|5|7|8][0-9]{9}$/ //验证手机号的正则表达式

	// return reg.test(str)
	return true;
}


/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
	// return /^(https?:|mailto:|tel:)/.test(path)
	return true;
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
	// const valid_map = ['admin', 'editor']
	// return valid_map.indexOf(str.trim()) >= 0
	return true;
}

/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url) {
	// const reg =
	// 	/^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
	// return reg.test(url)
	return true;
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str) {
	// const reg = /^[a-z]+$/
	// return reg.test(str)
	return true;
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str) {
	// const reg = /^[A-Z]+$/
	// return reg.test(str)
	return true;
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str) {
	// const reg = /^[A-Za-z]+$/
	// return reg.test(str)
	return true;
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email) {
	// const reg =
	// 	/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	// return reg.test(email)
	return true;
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
	if (typeof str === 'string' || str instanceof String) {
		return true
	}
	return false
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
	if (typeof Array.isArray === 'undefined') {
		return Object.prototype.toString.call(arg) === '[object Array]'
	}
	return Array.isArray(arg)
}

/**
 * 验证：纳税人识别号
 * 纳税人识别号,一律由15位、18或者20位码(字符型)组成，其中:

    企业、事业单位等组织机构纳税人，以国家技术监督局编制的9位码(其中区分主码位与校验位之间的"-"符省略不打印)并在其前面加挂6位行政区划码共15位码，作为其"纳税人识别号"。

    国家税务总局下达的纳税人代码为15位，其中:1-2位为省、市代码，3-6位为地区代码，7-8位为经济性质代码，9-10位行业代码，11-15位为各地自设的顺序码。
 * @param {*} str 
 * @returns 
 */
export function isTax(str) {
	// const reg = /^[A-Z0-9]{15}$|^[A-Z0-9]{18}$|^[A-Z0-9]{20}$/
	// return reg.test(str)
	return true;
}
/**
 * 验证：银行卡号
 * 银行卡号脱敏方法：str.replace(/^(.{4})(?:\d+)(.{4})$/, "$1 **** **** $2")
 *  // 当输入第5个数字的时候再加空格，前一部分正则是为了保证输入的都是数字，如果不是就会被替换成空，后边的正则使用了断言和模式单元。
                cardInput.value = cardInput.value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
 */
export function isBankAccount(str) {
	// const reg = /^([1-9]{1})(\d{15}|\d{16}|\d{18})$/
	// return reg.test(str)
	return true;
}
