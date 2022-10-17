<template>
	<view class="content idx-0 user-con flex-col">
		<view class="board-loading idx-100" v-if="refreshing" catchtouchmove="true">
			<tui-loading></tui-loading>
		</view>
		<view class="head idx-100 flex-row">
			<image class="head-logo" src="../../static/logo.png"></image>
			<text class="head-title">小屁排卡</text>
		</view>
		<view class="background idx-1">
			<image class="bg-up" src="../../static/bg_up.png"></image>
			<image class="bg-down" src="../../static/bg_down.png"></image>
		</view>
		<view class="tip-bar idx-5">
			<text class="tip-text">个 人 中 心</text>
		</view>
		<view class="user-board idx-5 flex-row">
			<view class="user-avatar-bg">
				<image class="user-avatar" src="../../static/me_selected.png" v-if="!ifLogin">
				</image>
				<image class="user-avatar" :src="user.avatar" v-if="ifLogin">
				</image>
			</view>
			<view class="user-info flex-col">
				<view class="flex-row isbind" v-if="isBind">
					<view class="user-rating flex-col"
						:style="'background-image: url(https://pic.gene-yp.com/i/2022/07/22/rank-'+ rank +'.png);'">
						<text class="rating">{{user.rating}}</text>
					</view>
					<image class="level" :src="'../../static/lvbg/'+ level +'.png'"></image>
				</view>
				<view class="flex-row notbind" v-if="!isBind">
					<tui-icon name="dissatisfied" color="#848484"></tui-icon>
					<text class="notbind-text">未绑定</text>
				</view>
				<view class="user-nickname">
					<text class="nickname" v-if="!ifLogin">未登录</text>
					<text class="nickname" v-if="ifLogin">{{user.nickname}}</text>
				</view>
			</view>
		</view>
		<view class="info-board flex-col idx-5" v-if="ifLogin">
			<view class="info-item">
				<text class="name-title">昵&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;称</text>
				<view class="name-input">
					<view class="pd-min">
						<tui-input backgroundColor="#FFFFFF00" color="#000000" type="nickname" v-model="nickname"
							placeholder="请输入昵称">
						</tui-input>
					</view>
				</view>
			</view>
			<image class="line" src="../../static/line.png"></image>
			<view class="info-item">
				<text class="name-title">查分账号</text>
				<view class="name-input">
					<view class="pd-min">
						<tui-input backgroundColor="#FFFFFF00" color="#000000" v-model="user.name" placeholder="查分器账号">
						</tui-input>
					</view>
				</view>
			</view>
			<image class="line" src="../../static/line.png"></image>
			<view class="info-item">
				<text class="name-title">设置头像</text>
				<view class="user-btn" @tap="setAvatar">
					<button style="background-color: #0000; margin-top: -12rpx;" open-type="chooseAvatar"
						@chooseavatar="setAvatar">
						<text class="user-btn-text">点击更换</text>
					</button>
				</view>
			</view>
			<image class="line" src="../../static/line.png"></image>
			<view class="info-item">
				<text class="name-title">查询成绩</text>
				<view class="user-btn" @tap="navToB40">
					<text class="user-btn-text">点击查询</text>
				</view>
			</view>
			<image class="line" src="../../static/line.png"></image>
			<view class="info-item">
				<text class="name-title">设置皮肤</text>
				<view class="user-btn" @tap="navToCard">
					<text class="user-btn-text">更换卡背</text>
				</view>
			</view>
			<image class="line" src="../../static/line.png"></image>
			<view class="info-item">
				<text class="name-title">关于“小屁排卡”</text>
				<view class="user-btn" @tap="navToAbout">
					<text class="user-btn-text">查看详情</text>
				</view>
			</view>
		</view>
		<view class="board-btn flex-row mg-btm">
			<view class="move-btn idx-5" @tap="update" v-if="ifLogin">
				<text class="name">更新信息</text>
			</view>
			<view class="quit-btn idx-5" @tap="logout" v-if="ifLogin">
				<text class="name">退出登录</text>
			</view>
			<view class="move-btn idx-5 mg-le flex-col" v-if="!ifLogin"
				style="margin-bottom: 46vh; margin-left: 188rpx;">
				<button @click="getUser" style="background-color: #0000; margin-top: 4rpx;">
					<text class="name">登录账号</text>
				</button>
			</view>
		</view>
		<tui-tabbar :current="tabIdx" backdropFilter backgroundColor="#333333" :tabBar="tabBar" color="#e6e6e6"
			selectedColor="#ffffff" @click="tabbarSwitch"></tui-tabbar>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapActions
	} from 'vuex'
	export default {
		data() {
			return {
				tabIdx: 2,
				tabBar: [{
						pagePath: '/pages/maidata/maidata',
						text: '资料库',
						iconPath: '/static/maidata.png',
						selectedIconPath: '/static/maidata_selected.png'
					},
					{
						pagePath: '/pages/index/index',
						text: '首页',
						iconPath: '/static/home.png',
						selectedIconPath: '/static/home_selected.png',
						hump: true
					},
					{
						pagePath: '/pages/user/user',
						text: '我的',
						iconPath: '/static/me.png',
						selectedIconPath: '/static/me_selected.png'
					}
				],
				refreshing: 0,
				isBind: false,
				ifLogin: false,
				nickname: '',
				rank: 9,
				level: 1,
				user: {
					avatar: '',
					nickname: '',
					name: '',
					password: '',
					rating: -1,
					level: 0,
					card_img: ''
				}
			}
		},
		onLoad() {
			uni.hideTabBar({
				animation: false
			});
			if (!this.getIsLogin) {
				this.init();
			}
		},
		onShow() {
			uni.hideTabBar({
				animation: false
			})
			this.tabIdx = 2;
		},
		computed: {
			...mapGetters(['getUserInfo', 'getNeedAuth', 'getIsLogin'])
		},
		methods: {
			...mapActions(['login', 'auth']),
			init() {
				// this.login();
				this.getUser();
			},
			tabbarSwitch(e) {
				this.tabIdx = e.index;
				uni.switchTab({
					url: e.pagePath
				})
			},
			navToB40() {
				uni.navigateTo({
					url: '../uploadscore/uploadscore'
				});
			},
			navToCard() {
				uni.navigateTo({
					url: '../changecard/changecard'
				});
			},
			navToAbout() {
				uni.navigateTo({
					url: '../about/about'
				});
			},
			getUser() {
				// this.auth();
				let that = this;
				this.login();
				this.refreshing = 1;
				this.$request.request({
					url: '/maique/user/getUser',
					header: {
						authorization: uni.getStorageSync("authorization"),
					},
					method: 'GET',
				}).then(res => {
					// console.log('获取用户信息：', res);
					if (res.code == 200) {
						that.user.name = res.data.name;
						that.user.nickname = res.data.nickname;
						that.nickname = res.data.nickname;
						that.user.avatar = res.data.avatar;
						that.user.card_img = res.data.cardImg;
						uni.setStorageSync('cardImg', res.data.cardImg);
						uni.setStorageSync('nickname', res.data.nickname);
						uni.setStorageSync('isLogin', 1);
						if (res.data.name == null || res.data.name == '') {
							that.isBind = false;
						} else if (res.data.rating == null || res.data.rating == '') {
							that.isBind = false;
							uni.showToast({
								title: '查分账号错误',
								image: '/static/warning.png',
								duration: 1500
							})
						} else {
							that.isBind = true;
							that.user.rating = res.data.rating;
							that.user.level = res.data.level;
							that.setLevelAndRating(res.data.level, res.data.rating);
						}
						that.ifLogin = true;
					} else {
						uni.showToast({
							title: '请重新登录',
							image: '/static/warning.png',
							duration: 1500
						})
						setTimeout(() => {
							this.getUser();
						}, 2000);
					}
					that.refreshing = 0;
				})
			},
			setAvatar(e) {
				// console.log('ava', e);
				if (e.detail.avatarUrl != null) {
					this.user.avatar = e.detail.avatarUrl;
					this.$request.request({
						url: '/maique/user/setAvatar',
						data: {
							"avatar": e.detail.avatarUrl
						},
						method: 'GET',
					}).then(res => {
						// console.log('修改头像', res)
					})
				}
			},
			update() {
				this.$request.request({
					url: '/maique/user/update',
					data: {
						"nickname": this.nickname,
						"name": this.user.name,
						"avatar": this.user.avatar
					},
					method: 'POST',
				}).then(res => {
					console.log('更新用户信息:', res);
					if (res.code == 200) {
						this.user.nickname = this.nickname;
						uni.setStorageSync('nickname', this.nickname);
					}
					this.getUser();
					uni.showToast({
						title: '更新成功',
						image: '/static/logo.png',
						duration: 1500
					})
				})
			},
			logout() {
				this.$request.request({
					url: '/maique/user/logout',
					header: {
						authorization: uni.getStorageSync("authorization"),
					},
					method: 'GET',
				}).then(res => {
					// console.log('注销:', res);
					if (res.code == 200) {
						this.isLogin = false;
						this.ifLogin = false;
						this.isBind = false;
						// this.user = [];
						// this.nickname = '';
						// this.level = 1;
						// this.rank = 9;
						// uni.setStorageSync('authorization', null);
						// uni.setStorageSync('shopId', null);
						// uni.setStorageSync('shopName', null);
						// uni.setStorageSync('gameId', null);
						// uni.setStorageSync('cardImg', null);
						// uni.setStorageSync('cardIdx', null);
						// uni.setStorageSync('openCode', null);
					}
				})
			},
			setLevelAndRating(level, rating) {
				var ra = rating;
				if (ra == -1) {
					this.isBind = false;
				} else {
					this.isBind = true;
				}
				// 获取rating
				if (ra < 1000) {
					this.rank = 0;
				} else if (ra < 2000) {
					this.rank = 1;
				} else if (ra < 3000) {
					this.rank = 2;
				} else if (ra < 4000) {
					this.rank = 3;
				} else if (ra < 5000) {
					this.rank = 4;
				} else if (ra < 6000) {
					this.rank = 5;
				} else if (ra < 7000) {
					this.rank = 6;
				} else if (ra < 8000) {
					this.rank = 7;
				} else if (ra < 8500) {
					this.rank = 8;
				}
				// 获取段位
				var lv = level;
				if (lv < 250) {
					this.level = 1;
				} else if (lv < 500) {
					this.level = 2;
				} else if (lv < 750) {
					this.level = 3;
				} else if (lv < 1000) {
					this.level = 4;
				} else if (lv < 1200) {
					this.level = 5;
				} else if (lv < 1400) {
					this.level = 6;
				} else if (lv < 1500) {
					this.level = 7;
				} else if (lv < 1600) {
					this.level = 8;
				} else if (lv < 1700) {
					this.level = 9;
				} else if (lv < 1800) {
					this.level = 10;
				} else if (lv < 1850) {
					this.level = 11;
				} else if (lv < 1900) {
					this.level = 12;
				} else if (lv < 1950) {
					this.level = 13;
				} else if (lv < 2000) {
					this.level = 14;
				} else if (lv < 2010) {
					this.level = 15;
				} else if (lv < 2020) {
					this.level = 16;
				} else if (lv < 2030) {
					this.level = 17;
				} else if (lv < 2040) {
					this.level = 18;
				} else if (lv < 2050) {
					this.level = 19;
				} else if (lv < 2060) {
					this.level = 20;
				} else if (lv < 2070) {
					this.level = 21;
				} else if (lv < 2080) {
					this.level = 22;
				} else if (lv < 2090) {
					this.level = 23;
				} else if (lv < 2100) {
					this.level = 24;
				} else {
					this.level = 25;
				}
			}
		}
	}
</script>

<style>
	.user-board {
		height: 318rpx;
		width: 94%;
		margin-left: 3%;
		background-image: url(data:image/png;base64,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);
		background-size: contain;
		background-repeat: no-repeat;
	}

	.user-avatar-bg {
		height: 196rpx;
		width: 196rpx;
		margin-top: 50rpx;
		margin-left: 46rpx;
		border-radius: 16rpx;
		box-shadow: inset 0 0 0 6rpx #0068b3, inset 0 0 0 18rpx #fff, 0 8rpx 0 0 #0068b3;
	}

	.user-avatar {
		height: 160rpx;
		width: 160rpx;
		margin-top: 18rpx;
		margin-left: 18rpx;
		overflow: hidden;
	}

	.user-info {
		height: 196rpx;
		width: 400rpx;
		margin-top: 48rpx;
		margin-left: 20rpx;
	}

	.user-rating {
		width: 330rpx;
		height: 200rpx;
		margin-top: 22rpx;
		align-items: flex-end;
		background-size: contain;
		background-repeat: no-repeat;
	}

	.level {
		width: 134rpx;
		height: 60rpx;
		margin-top: 22rpx;
	}

	.rating {
		color: #ffd900;
		font-weight: 900;
		font-size: 32rpx;
		text-shadow: 2rpx 2rpx 0rpx #000000;
		letter-spacing: 7rpx;
		padding-top: 8rpx;
		padding-right: 24rpx;
	}

	.isbind {
		width: 400rpx;
		height: 80rpx;
	}

	.notbind {
		align-items: center;
		width: 180rpx;
		height: 60rpx;
		margin-top: 20rpx;
	}

	.notbind-text {
		font-size: 36rpx;
		color: #848484;
		margin-left: 12rpx;
		white-space: nowrap;
	}

	.user-nickname {
		display: flex;
		width: 380rpx;
		height: 72rpx;
		background-color: #FFFFFF;
		margin-top: 20rpx;
		border-radius: 12rpx;
		box-shadow: inset 2rpx 2rpx 6rpx 2rpx #333333;
	}

	.nickname {
		margin-left: 20rpx;
		margin-top: 12rpx;
		font-size: 36rpx;
		white-space: nowrap;
	}

	.mg-btm {
		margin-top: 26rpx;
		margin-bottom: 260rpx;
	}
</style>
