import App from './App'
import store from './store';
// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
import mixins from './mixin/mixin'
import cloudService from './api/cloudService'
Vue.mixin(mixins)
Vue.prototype.$cloudService = cloudService
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	store,
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}


// #endif