/**
 * 演示接口
 */
export default {
	//获取类别列表
	getClasses: (params) => uni.$u.http.post('/clazz/getClasses', params, {custom: {catch: true}}),
	//新增类别
	addClass: (params) => uni.$u.http.post('/clazz/addClass', params, {custom: {auth: true}}),
	//修改类别
	updateClass: (params) => uni.$u.http.post('/clazz/updateClass', params, {custom: {auth: true}}),
	//批量修改类别
	batchUpdateClass: (params) => uni.$u.http.post('/clazz/batchUpdateClass', params, {custom: {auth: true}}),
	//删除类别
	deleteClass: (params) => uni.$u.http.post('/clazz/deleteClass', params, {custom: {auth: true}}),
}