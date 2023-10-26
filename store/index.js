import Vue from 'vue';
import Vuex from 'vuex';

const files = require.context('./modules', false, /\.js$/)
let modules = {};
files.keys().forEach(key => {
	modules[key.slice(2, -3)] = files(key).default
})

Vue.use(Vuex);

export default new Vuex.Store({
	modules
})
