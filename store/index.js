import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		userinfo: {},
		needAuth: true,
		isLogin: false
	},
	getters: {
		getUserInfo(state) {
			return state.userinfo;
		},
		getNeedAuth(state) {
			return state.needAuth;
		},
		getIsLogin(state) {
			return state.isLogin;
		}
	},
	//同步
	mutations: {
		setUserInfo(state, userinfo) {
			state.userinfo = userinfo;
		},
		setNeedAuth(state, needAuth) {
			state.userinfo = needAuth;
		},
		setIsLogin(state, isLogin) {
			state.userinfo = isLogin;
		}
	},
	//异步
	actions: {
		login(context) {
			return new Promise((resolve, reject) => {
				uni.login({
					provider: 'weixin',
					success: (res) => {
						uni.setStorageSync('openCode', res.code)
						Vue.prototype.$request.request({
							url: '/maique/wx/user/' + Vue.prototype.appid + '/login',
							data: {
								"code": res.code,
								"token": uni.getStorageSync("authorization")
							},
							method: 'GET',
						}).then(res => {
							console.log('尝试登录', res)
							uni.setStorageSync("authorization", res.data.token);
							uni.setStorageSync("uuid", res.data.user.uuid);
							if (res.desc == "登录成功") {
								context.commit('setUserInfo', res.data.user);
								context.commit('setNeedAuth', false);
								context.commit('setIsLogin', true);
							}
							resolve("login执行完毕");
						});
					},
					fail: (res) => {
						uni.showToast({
							title: '登录失败',
							image: '/static/warning.png',
							duration: 1500
						})
						// Vue.prototype.$u.toast("login执行失败");
						reject("获取code失败");
					}
				})
			})
		},
		// auth(context) {
		// 	return new Promise((resolve, reject) => {
		// 		uni.getUserProfile({
		// 			desc: 'weixin',
		// 			success: (res) => {
		// 				context.commit('setUserInfo', {
		// 					nickname: res.userInfo.nickName,
		// 					gender: res.userInfo.gender,
		// 					avatar: res.userInfo.avatarUrl,
		// 				})
		// 				Vue.prototype.$request.request({
		// 					url: '/maique/wx/user/' + Vue.prototype.appid + '/auth',
		// 					data: context.state.userinfo,
		// 					method: 'POST',
		// 				}).then(res => {
		// 					if (res.desc == '授权成功') {
		// 						context.commit('setNeedAuth', false);
		// 					} else {
		// 						uni.showToast({
		// 							title: '授权异常',
		// 							image: '/static/warning.png',
		// 							duration: 1500
		// 						})
		// 					}
		// 					// Vue.prototype.$request.request({
		// 					// 	url: '/maique/user/getUser',
		// 					// 	method: 'GET',
		// 					// }).then(res => {
		// 					// 	console.log('获取用户信息：', res);
		// 					// })
		// 					resolve("授权完毕");
		// 				})
		// 			},
		// 			fail: (err) => {
		// 				reject("获取信息出错！");
		// 				console.log('授权失败！');
		// 			}
		// 		})
		// 	})
		// }
	}
})

export default store
