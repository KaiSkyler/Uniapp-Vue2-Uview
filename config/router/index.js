const files = require.context('./modules', false, /\.js$/)
let router = {};
files.keys().forEach(key => {
	router[key.slice(2, -3)] = files(key).default
})

export default router
