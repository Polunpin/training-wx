// store/index.js
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
const store = new Vuex.Store({
	state: {
		userinfo: uni.getStorageSync('userinfo') ? uni.getStorageSync('userinfo') : null
	},
	getters: {
		userinfo: state => state.userinfo
	},
	mutations: {
		setUserinfo(state, userinfo) {
			state.userinfo = userinfo
			uni.setStorageSync('userinfo', userinfo)
		}
	}
});
export default store