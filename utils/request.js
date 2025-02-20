import {
	baseURL
} from './config.js'

/**
 * 封装uni.request请求
 * @param {Object} options - 请求配置
 * @param {string} options.url - 请求地址
 * @param {string} [options.method='GET'] - 请求方法
 * @param {Object} [options.data] - 请求数据
 * @param {Object} [options.header] - 请求头
 * @param {number} [options.timeout=30000] - 超时时间（毫秒）
 * @returns {Promise} 返回Promise对象
 */
export function request(options = {}) {
	return new Promise((resolve, reject) => {
		const token = uni.getStorageSync('token') || ''
		const defaultOptions = {
			url: baseURL + options.url,
			method: options.method || 'GET',
			data: options.data,
			header: {
				'content-type': 'application/json',
				'token': token,
				...options.header
			},
			timeout: options.timeout || 30000
		}
		console.log(baseURL + options.url,'请求地址')

		uni.request({
			...defaultOptions,
			success: (res) => {
				if (res.statusCode === 200) {
					if (res.data.code === 0) {
						resolve(res.data.data)
					} else {
						reject(res)
					}
				} else {
					reject(res)
					handleError(res)
				}
			},
			fail: (err) => {
				reject(err)
				handleError(err)
			}
		})
	})
}

/**
 * 处理请求错误
 * @param {Object} error - 错误对象
 */
function handleError(error) {
	console.error('请求错误：', error)
	uni.showToast({
		title: '网络请求失败，请稍后重试',
		icon: 'none'
	})
}

// 导出 GET 请求方法
export function get(url, data = {}, options = {}) {
	return request({
		url,
		method: 'GET',
		data,
		...options
	})
}

// 导出 POST 请求方法
export function post(url, data = {}, options = {}) {
	return request({
		url,
		method: 'POST',
		data,
		...options
	})
}