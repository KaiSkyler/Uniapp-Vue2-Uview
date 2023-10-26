const files = require.context('./modules', false, /\.js$/)
let api = {};
files.keys().forEach(key => {
	api[key.slice(2, -3)] = files(key).default || {}
})

export default api
