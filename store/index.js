// store/index.js
import Vue from 'vue';
import Vuex from 'vuex';
import api from '../api/cloudService'

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
	},
	actions: {
		async initUserinfo({ commit }) {
			const res = await api.call({
				path:'/users/info'
			})
			commit('setUserinfo', res.data)
		}
	}
});
export default store