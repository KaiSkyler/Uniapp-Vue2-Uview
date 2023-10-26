const optionsUrl = {
	//是否开启调试
	isDebug: process.env.NODE_ENV === 'development',
	//开发环境路径
	devUrl: "",
	//线上环境路径
	prodUrl: "",
}


//模块导出引用
module.exports = {
	optionsUrl
}
