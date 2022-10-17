<template>
	<view class="content idx-0 flex-col">
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
			<text class="tip-text">排 队 板</text>
		</view>
		<view class="shop-bar idx-5 flex-row" @tap="chooseShop">
			<text class="machine name" v-if="shop.no == 0">未指定</text>
			<text class="shop name" v-if="shop.name == ''">点击此处选择机厅</text>
			<text class="machine name" v-if="shop.no != 0">{{shop.no}} 号机</text>
			<text class="shop name" v-if="shop.name != ''">{{shop.name}}</text>
		</view>
		<view class="board-btn idx-5 flex-row">
			<view class="move-btn idx-5" @tap="moveCard">
				<text class="name">移&nbsp;&nbsp;&nbsp;卡</text>
			</view>
			<view class="quit-btn idx-5" @tap="quitOut" v-if="ifJoin">
				<text class="name">退&nbsp;&nbsp;&nbsp;出</text>
			</view>
			<view class="join-btn idx-5" @tap="joinIn" v-if="!ifJoin">
				<text class="name">加&nbsp;&nbsp;&nbsp;入</text>
			</view>
		</view>
		<view class="board idx-5 flex-row" v-if="isLoad">
			<tui-drag class="board-content" ref="drag" @sortend="sortEnd" :listData="cardList" itemHeight="190"
				columns="4">
				<template v-slot:default="{entity}">
					<view class="card-list flex-col">
						<image class="card-img" :src="entity.src" mode="widthFix"
							@tap="chooseOut(entity.uuid, entity.name)" @longpress="getCard(entity.id, entity.name)">
						</image>
						<text class="card-name">{{entity.name}}</text>
					</view>
				</template>
			</tui-drag>
		</view>
		<tui-modal :show="confirm" title="提示" :content="'要把' + moveOutName + '踢出队伍吗？'" :maskClosable="true"
			@click="moveOut" @cancel="hideConfirm"></tui-modal>

		<view class="history idx-5">
			<scroll-view class="history-list idx-5" scroll-y="true">
				<view class="history-item" v-for="(history, historyIdx) in boardLog" :key="history.id">
					<text class="his-text"> {{history.time}} </text>
					<text class="his-name"> {{history.name}} </text>
					<text class="his-text" v-if="history.status == 0"> 加入了。 </text>
					<text class="his-text" v-if="history.status == 1"> 离开了。 </text>
					<text class="his-text" v-if="history.status == 2"> 让 </text>
					<text class="his-name" v-if="history.status == 2"> {{history.from}} </text>
					<text class="his-text" v-if="history.status == 2"> 回到了队尾。 </text>
					<text class="his-text" v-if="history.status == 3"> 把 </text>
					<text class="his-name" v-if="history.status == 3"> {{history.from}} </text>
					<text class="his-text" v-if="history.status == 3"> 移到了 </text>
					<text class="his-pos" v-if="history.status == 3"> {{history.to}} </text>
					<text class="his-text" v-if="history.status == 3"> 号位置。 </text>
					<text class="his-text" v-if="history.status == 4"> 把 </text>
					<text class="his-name" v-if="history.status == 4"> {{history.from}} </text>
					<text class="his-text" v-if="history.status == 4"> 移出了队伍。 </text>
				</view>
			</scroll-view>
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
				lng: -1,
				lat: -1,
				confirm: false,
				version: 0,
				isChoosed: -1,
				// isArrive: 0,
				moveOutName: '',
				shop: {
					id: 0,
					no: 0,
					name: ''
				},
				user: {
					isLogin: 0,
					uuid: '',
					cardImg: '',
					nickname: '',
					position: -1
				},
				refreshing: 0,
				ifJoin: 0,
				isLoad: 1,
				tabIdx: 1,
				cardList: [],
				cardFrom: {},
				boardLog: [],
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
				]
			}
		},
		onLoad(option) {
			uni.hideTabBar({
				animation: false
			})
			this.initUser();
			this.login();
			// this.initPosition();
			// this.checkPosition();
			if (option.shopId == null || option.gameId == null) {
				console.log("路径为空");
			} else {
				console.log("路径不为空", option);
				uni.setStorageSync('shopId', option.shopId);
				uni.setStorageSync('gameId', option.gameId);
				this.shop.id = option.shopId;
				this.shop.no = option.gameId;
				this.$request.request({
					url: '/maique/shop/id/' + this.shop.id,
					method: 'GET',
				}).then(res => {
					if (res.data == null) {
						this.shop.name = "获取机厅名失败";
						return;
					} else {
						uni.setStorageSync('shopName', res.data.name);
						this.shop.name = res.data.name;
					}
				});
			}
		},
		onShow() {
			uni.hideTabBar({
				animation: false
			})
			this.tabIdx = 1;
			this.refreshing = 1;
			// 获取机厅和机台
			this.shop.id = uni.getStorageSync('shopId');
			this.shop.no = uni.getStorageSync('gameId');
			this.shop.name = uni.getStorageSync('shopName');
			this.user.nickname = uni.getStorageSync('nickname');
			this.user.cardImg = uni.getStorageSync('cardImg');
			this.user.uuid = uni.getStorageSync('uuid');
			this.user.isLogin = uni.getStorageSync('isLogin');
			// 获取该机台排卡板的信息
			setInterval(this.initBoard,5000);
			// setInterval(this.initPosition,35000);
			// setInterval(this.checkPosition,10000);
			this.initBoard();
			// 获取日志板
			this.initLogs();
			setTimeout(() => {
				this.refreshing = 0;
			}, 1800);
		},
		computed: {
			...mapGetters(['getUserInfo', 'getNeedAuth', 'getIsLogin'])
		},
		methods: {
			...mapActions(['login', 'auth']),
			checkLogin() {
				if (this.user.nickname != '' && this.user.nickname != null &&
					this.user.cardImg != '' && this.user.cardImg != null &&
					this.user.uuid != '' && this.user.uuid != null) {
					return true;
				} else {
					return false;
				}
			},
			chooseShop() {
				uni.navigateTo({
					url: '../selectshop/selectshop'
				});
			},
			tabbarSwitch(e) {
				this.tabIdx = e.index;
				uni.switchTab({
					url: e.pagePath
				})
			},
			initPosition() {
				let that = this;
				uni.getLocation({
					type: 'wgs84',
					success: res => {
						console.log('获取地理位置：', res);
						that.lat = res.latitude;
						that.lng = res.longitude;
					}
				});
			},
			initBoard() {
				let list = [];
				this.$request.request({
					url: '/maique/que/get/' + this.shop.id + '/' + this.shop.no,
					method: 'GET',
				}).then(res => {
					// console.log("排卡板信息：", res);
					if (res.data == null) {
						this.cardList = list;
						this.ifJoin = 0;
						return;
					}
					let info = JSON.parse(res.data.detail);
					this.version = res.data.version;
					for (let i = 0; i < info.length; i++) {
						list.push({
							id: i,
							uuid: info[i].uuid,
							src: info[i].cardImg,
							name: info[i].nickname
						})
					}
					this.cardList = list;
					let uuid = this.user.uuid;
					let findMe = list.find(item => {
						if (item.uuid == uuid) {
							return item
						}
					});
					if (findMe != null) {
						this.ifJoin = 1;
					} else {
						this.ifJoin = 0;
					}
				});
			},
			initLogs() {
				let logs = [];
				this.$request.request({
					url: '/maique/logs/get/' + this.shop.id + '/' + this.shop.no,
					method: 'GET',
				}).then(res => {
					console.log('获取日志:', res);
					if (res.data == null) {
						this.boardLog = logs;
						return;
					}
					for (let i = 0; i < res.data.length; i++) {
						logs.push({
							id: i,
							name: res.data[i].name,
							from: res.data[i].cardFrom,
							to: res.data[i].cardTo,
							time: res.data[i].timeMsg,
							status: res.data[i].status
						})
					}
					logs.sort(function(a, b) {
						return b.id - a.id;
					});
					this.boardLog = logs;
				});
			},
			initUser() {
				this.$request.request({
					url: '/maique/user/getUser',
					header: {
						authorization: uni.getStorageSync("authorization"),
					},
					method: 'GET',
				}).then(res => {
					console.log('获取用户信息：', res);
					if (res.code == 200) {
						uni.setStorageSync('cardImg', res.data.cardImg);
						uni.setStorageSync('nickname', res.data.nickname);
						this.user.nickname = res.data.nickname;
						this.user.cardImg = res.data.cardImg;
					} else {
						setTimeout(() => {
							this.initUser();
						}, 500);
					}
				});
			},
			refBoard() {
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				});
				setTimeout(() => {
					this.refreshing = 0;
					// uni.pageScrollTo({
					// 	scrollTop: 190,
					// 	duration: 300
					// })
				}, 1800)
			},
			checkPosition() {
				let that = this;
				that.$request.request({
					url: '/maique/shop/checkPosition/' + that.lng + '/' + that.lat + '/' + this.shop.id,
					method: 'GET',
				}).then(res => {
					console.log('获取是否到机厅：', res);
					if (res.data == 1) {
						console.log('我在机厅');
						that.isArrive = 1;
					} else {
						console.log('我不在机厅');
						that.isArrive = 0;
					}
				});
			},
			pushLog(name, cardFrom, cardTo, status) {
				var date = new Date();
				var hour = ("0" + date.getHours()).slice(-2);
				var minute = ("0" + date.getMinutes()).slice(-2);
				var second = ("0" + date.getSeconds()).slice(-2);
				var timemsg = "[" + hour + ":" + minute + ":" + second + "]";
				// 上传日志
				this.$request.request({
					url: '/maique/logs/add/' + this.shop.id + '/' + this.shop.no,
					data: {
						'name': name,
						'cardFrom': cardFrom,
						'cardTo': cardTo,
						'timeMsg': timemsg,
						'status': status
					},
					method: 'POST',
				}).then(res => {
					console.log('上传日志:', res);
					this.boardLog.push({
						id: this.boardLog.length,
						name: name,
						from: cardFrom,
						to: cardTo,
						time: timemsg,
						status: status
					});
				})
			},
			getCard(id, name) {
				this.cardFrom = {
					id: id,
					name: name,
				};
			},
			moveCard() {
				// if (this.isArrive == 0) {
				// 	uni.showToast({
				// 		title: '请前往机厅操作',
				// 		image: '/static/warning.png',
				// 		duration: 2000
				// 	})
				// 	return;
				// }
				if (this.ifJoin == 0) {
					uni.showToast({
						title: '请先排卡',
						image: '/static/warning.png',
						duration: 1500
					})
					return;
				}
				this.refreshing = 1;
				let user = this.user.nickname;
				let head = this.cardList[0].name;
				let list = [];
				// 后端移卡，获取cardList
				this.$request.request({
					url: '/maique/que/push/' + this.shop.id + '/' + this.shop.no + '/' + this.version,
					method: 'GET',
				}).then(res => {
					console.log(res);
					if (res.code == 500) {
						uni.showToast({
							title: '数据已过期',
							image: '/static/warning.png',
							duration: 1500
						})
						// 刷新页面
						this.initBoard();
						this.refBoard();
						return;
					}
					this.version = res.data.version;
					// 前端重新渲染
					this.cardList.push(this.cardList.shift());
					this.initBoard();
					this.refBoard();
					this.pushLog(user, head, '', 2);
				});
			},
			joinIn(e) {
				// if (this.isArrive == 0) {
				// 	uni.showToast({
				// 		title: '请前往机厅操作',
				// 		image: '/static/warning.png',
				// 		duration: 2000
				// 	})
				// 	return;
				// }
				this.refreshing = 1;
				// 获取当前用户的name，卡背
				var user = this.user.nickname;
				var cardImg = this.user.cardImg;
				var uuid = this.user.uuid;
				console.log('join', user, cardImg);
				// 请求服务器
				this.$request.request({
					url: '/maique/que/add/' + this.shop.id + '/' + this.shop.no + '/' + this.version,
					method: 'GET',
				}).then(res => {
					console.log(res);
					if (res.code == 500) {
						uni.showToast({
							title: '数据已过期',
							image: '/static/warning.png',
							duration: 1500
						})
						// 刷新页面
						this.initBoard();
						this.refBoard();
						return;
					}
					this.version = res.data.version;
					this.cardList.push({
						id: this.cardList.length,
						uuid: uuid,
						src: cardImg,
						name: user
					});
					this.user.position = this.cardList.length;
					this.ifJoin = 1;
					this.pushLog(user, '', '', 0);
				});
				// 重新渲染
				this.refBoard();
			},
			quitOut() {
				this.refreshing = 1;
				// 获取当前用户的name，卡背
				var user = this.user.nickname;
				var cardImg = this.user.cardImg;
				var uuid = this.user.uuid;
				var findMe = this.cardList.find(item => {
					if (item.uuid == uuid) {
						return item
					}
				})
				// 请求服务器
				this.$request.request({
					url: '/maique/que/quit/' + this.shop.id + '/' + this.shop.no + '/' + findMe.id + '/' + this
						.version,
					method: 'GET',
				}).then(res => {
					console.log(res);
					if (res.code == 500) {
						uni.showToast({
							title: '数据已过期',
							image: '/static/warning.png',
							duration: 1500
						})
						// 刷新页面
						this.initBoard();
						this.refBoard();
						return;
					}
					this.version = res.data.version;
					this.cardList.splice(findMe.id, 1);
					this.user.position = -1;
					this.ifJoin = 0;
					// 刷新页面
					this.initBoard();
					this.pushLog(user, '', '', 1);
				});
				// 重新渲染
				this.refBoard();
			},
			sortEnd(e) {
				// if (this.isArrive == 0) {
				// 	uni.showToast({
				// 		title: '请前往机厅操作',
				// 		image: '/static/warning.png',
				// 		duration: 2000
				// 	})
				// 	this.refreshing = 1;
				// 	this.isLoad = 0;
				// 	this.$nextTick(() => {
				// 		this.isLoad = 1;
				// 	})
				// 	this.refBoard();
				// 	return;
				// }
				if (this.ifJoin == 0) {
					uni.showToast({
						title: '请先排卡',
						image: '/static/warning.png',
						duration: 1500
					})
					this.refreshing = 1;
					this.isLoad = 0;
					this.$nextTick(() => {
						this.isLoad = 1;
					})
					this.refBoard();
					return;
				}
				// 获取当前用户的name，卡背
				let user = this.user.nickname;
				let cardTo = 0;
				for (let i = 0; i < e.listData.length; i++) {
					// 找到TO的位置
					if (e.listData[i].name == this.cardFrom.name) {
						cardTo = i;
					}
				}
				if (cardTo == this.cardFrom.id) {
					return;
				} else {
					this.refreshing = 1;
					// 请求服务器
					this.$request.request({
						url: '/maique/que/move/' + this.shop.id + '/' + this.shop.no + '/' + this.cardFrom.id +
							'/' + cardTo + '/' + this.version,
						method: 'GET',
					}).then(res => {
						console.log(res);
						if (res.code == 500) {
							uni.showToast({
								title: '数据已过期',
								image: '/static/warning.png',
								duration: 1500
							})
							// 刷新页面
							this.initBoard();
							this.refBoard();
							return;
						}
						this.version = res.data.version;
						this.cardList = e.listData;
						// 刷新页面
						this.initBoard();
						this.pushLog(user, this.cardFrom.name, cardTo + 1, 3);
					});
					// 重新渲染
					this.refBoard();
				}
			},
			chooseOut(uuid, name) {
				// if (this.isArrive == 0) {
				// 	uni.showToast({
				// 		title: '请前往机厅操作',
				// 		image: '/static/warning.png',
				// 		duration: 2000
				// 	})
				// 	return;
				// }
				this.confirm = true;
				this.moveOutName = name;
				this.isChoosed = uuid;
			},
			moveOut(e) {
				let index = e.index;
				this.confirm = false;
				// 0(取消) 1(确认)
				if (index != 0) {
					if (this.ifJoin == 0) {
						uni.showToast({
							title: '请先排卡',
							image: '/static/warning.png',
							duration: 1500
						})
						return;
					}
					let outUuid = this.isChoosed;
					let uuid = this.user.uuid;
					if (outUuid == uuid) {
						this.quitOut()
						return;
					}
					// 踢出去
					let itemOut = this.cardList.find(item => {
						if (item.uuid == outUuid) {
							return true
						}
					})
					this.refreshing = 1;
					// 请求服务器
					this.$request.request({
						url: '/maique/que/quit/' + this.shop.id + '/' + this.shop.no + '/' + itemOut.id + '/' +
							this.version,
						method: 'GET',
					}).then(res => {
						if (res.code == 500) {
							uni.showToast({
								title: '数据已过期',
								image: '/static/warning.png',
								duration: 1500
							})
							// 刷新页面
							this.initBoard();
							this.refBoard();
							return;
						}
						this.version = res.data.version;
						this.cardList.splice(itemOut.id, 1);
						this.initBoard();
						let user = this.user.nickname;
						let outUser = itemOut.name;
						this.pushLog(user, outUser, '', 4);
						this.refBoard();
					});
				}
			},
			hideConfirm() {
				this.confirm = false;
			}
		}
	}
</script>

<style>
	.shop-bar {
		width: 80%;
		margin-left: 10%;
		margin-top: 10rpx;
		height: 148rpx;
		background-image: url(data:image/png;base64,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1cb81TJ6nDzyXHXkkUceeeSRN8x5eUTDCiB3zAHcHMgj5uBvDvpx5g3BXOyt4l0HfPLII4888sgjj7xRy8sLNl0CAAsbQ5BHXjryyCMvHXnk5SlvmNCwAsidaIOC+PnK4qLH7TrXWhDyyCOPPPLII488V90w5+UFU4IB5JKZQmNPlXGJ3hiiHffS6kRe4nHy0uvIc9eR564jz11HnruOPHcdee66vKBhBTDyzBoPczEHbHuDgvgB3FXnOsi76shz15HnriPPXUeeu448dx157jry3HXk5RdTggGMPHMQN3+NNBsQmNsu5nG7zt7UwBZlkEceeUnkkUceeeQNb15e0bACAAAAAIYSDSuAkRdtSuAP2Nbd3qAgWvvhYm9yQB555JFHXhJ55JE3nHl55R5TBoARYtZzuM5TFreTGpGXijw38tzIcyPPjTw38tzIO1xoWAHkklnvYdZz+NYW8S523aAt5MkjjzzyXHXkuevIc9eR564jz123F3l5QMMKIHfMxgTxTQlcf520N1CIuA745JFHHnnkkUceeaOWlxesYQUAAAAADCUaVgC5Y29KMGgjg91soEBeEnnuOvLcdeS568hz15HnriPPXUeeuy4vmBIMIBeiaTHRWg8zhcY+6Eeoo4466qijjjrq8lqXRzSsAEZe2sYD8QM4ddRRRx111FFHXV7r8oqGFcDI2+nGCHaduXbV7WajBfKSdeSRRx555JFHXjZ5ecUaVgCHhv2msBfII4+8dOSRR1468sjLMm/UMMIKYORFU2IGbTwQbWQQ/QUyWvcRF021safeuJBHHnnkkUceeeQNU15e0bACGHmtVmvzgB/faMG+bzYooI466qijjjrqqMtjXV7RsALIhfhfFqMNChS+YUUH9HidOUF3NNXG/NUyepw88lx15JFHHnnkkTfMeXlEwwogd8wB3BzII+bgbw76ceYNwVzsreJdB3zyyCOPPPLII4+8UcvLCzZdAgALG0OQR1468sgjLx155OUpb5jQsALInWiDgvj5yuKix+0611oQ8sgjjzzyyCOPPFfdMOflBVOCAeSSmUJjT5Vxid4Yoh330upEXuJx8tLryHPXkeeuI89dR567jjx3HXnuurygYQUw8swaD3MxB2x7g4L4AdxV5zrIu+rIc9eR564jz11HnruOPHcdee468tx15OUXU4IBjDxzEDd/jTQb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);
		background-size: contain;
		background-repeat: no-repeat;
	}

	.machine {
		padding-left: 56rpx;
	}

	.shop {
		width: 58%;
		padding-left: 62rpx;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.board {
		width: 96%;
		height: 1400rpx;
		margin-left: 2%;
		background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAeAAAAOXCAYAAAD8bJLFAAAgAElEQVR4nOzdyXIb2bbm+bUdYN+IEilRvSIUJ869k6yc1IuU5SytHq8sZ2n1EDWtSVqVWd2MiKNQS1EiJfY94btsLQdIbwAQAAFsh+P/M2MwRFEkAIL4fHdrCQAAAAAAAAAAAAAAAABgcC79L//b7xuexxIAgNH4r3/u3uRuxGMMAMD4EcAAAARAAAMAEAABDABAAAQwAAABEMAAAARAAAMAEEA98y05BQwAwFjUC9/EFT6S8V/++/9R+BgAANPuv/+X/737I5Ab5DIFDQBAAAQwAAABEMAAAARAAAMAEAABDABAAAQwAAABEMAAAARAAAMAEAABDABAAAQwAAABEMAAAARAAAMAEAABDABAAAQwAAABEMAAAARAAAMAEAABDABAAAQwAAABEMAAAARAAAMAEAABDABAAAQwAAABEMAAAARAAAMAEAABDABAAAQwAAABEMAAAARAAAMAEAABDABAAAQwAAABEMAAAARAAAMAEAABDABAAAQwAAABEMAAAARAAAMAEAABDABAAAQwAAABEMAAAARAAAMAEAABDABAAAQwAAABEMAAAARAAAMAEAABDABAAAQwAAABEMAAAARAAAMAEAABDABAAAQwAAABEMAAAARAAAMAEAABDABAAAQwAAABEMAAAARAAAMAEAABDABAAAQwAAABEMAAAARAAAMAEAABDABAAAQwAAABEMAAAARAAAMAEAABDABAAAQwAAABEMAAAARAAAMAEAABDABAAAQwAAABEMAAAARAAAMAEAABDABAAAQwAAABEMAAAARAAAMAEAABDABAAAQwAAABEMAAAARAAAMAEAABDABAAAQwAAAB1If9LX3zvSv8zf2/5rC/7n35IdyeMj9e3Lb7fR1u22Bfh9s22Nfhtk2evgM4fvOfCx9rx334H20+Ohif+p7+nl8rGvLtuu/taSnr4yXctoFx2wbDbRsMt61/w8yDXrMxjSloAAACIIABAAiAAAYAIAACGACAAAhgAAACIIABAAiAAAYAIAACGACAAAhgAAACIIABAAiAAAYAIAACGACAAAhgAAACIIABAAiAAAYAIAACGACAAAhgAAACIIABAAig3u+3jD78j8LH2onf/Oc2Hx1Mr9+T25UY5u0SbtvAuG2D4bYNhtvWv9C3ixEwAAABEMAAAARAAAMAEAABDABAAAQwAAABEMAAAARAAAMAEAABDABAAAQwAAABEMAAAARAAAMAEAABDABAAAQwAAABEMAAAARAAAMAEAABfA9+Ym85ACC0kQTwsIOp6kFX5seL2xb+a3HbyvH1uG3hv9awb1toEzMCZrTZnzI/Xty2wXDbBsNtGwy3bfRc+jv8t39s+OxHiv63//v/KXwMAIBp93/+r/+p+yPgRf7rX7s3KcsaMAAAARDAAAAEQAADABAAAQwAQAAEMAAAARDAAAAEQAADABAAAQwAQAAEMAAAARDAAAAEQAADABAAAQwAQAAEMAAAARDAAAAEQAADABAAAQwAQAAEMAAAARDAAAAEQAADABAAAQwAQAAEMAAAARDAAAAEQAADABAAAQwAQAAEMAAAARDAAAAEQAADABAAAQwAQAAEMAAAARDAAAAEQAADABAAAQwAQAAEMAAAARDAAAAEQAADABAAAQwAQAAEMAAAARDAAAAEQAADABAAAQwAQAAEMAAAARDAAAAEQAADABAAAQwAQAAEMAAAARDAAAAEQAADABAAAQwAQAAEMAAAARDAAAAEQAADABAAAQwAQAAEMAAAARDAAAAEQAADABAAAQwAQAAEMAAAARDAAAAEQAADABAAAQwAQAAEMAAAARDAAAAEQAADABAAAQwAQAAEMAAAARDAAAAEQAADABAAAQwAQAAEMAAAARDAAAAEQAADABAAAQwAQAAEMAAAARDAAAAEQAADABAAAQwAQAAEMAAAARDAAAAEQAADABAAAQwAQAAEMAAAARDAAAAEQAADABAAAQwAQAAEMAAAARDAAAAEQAADABAAAQwAQAAEMAAAARDAAAAEQAADABAAAQwAQAAEMAAAARDAAAAEQAADABAAAQwAQAAEMAAAARDAAAAEQAADABAAAQwAQAAEMAAAARDAAAAEQAADABAAAQwAQAAEMAAAARDAAAAEQAADABAAAQwAQAAEMAAAARDAAAAEQAADABAAAQwAQAAEMAAAARDAAAAEQAADABAAAQwAQAAEMAAAARDAAAAEQAADABAAAQwAQAAEMAAAARDAAAAEQAADABAAAQwAQAAEMAAAARDAAAAEQAADABAAAQwAQAAEMAAAARDAAAAEQAADABAAAQwAQAAEMAAAARDAAAAEQAADABAAAQwAQAAE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AAACIIABAAiAAAYAIAACGACAAAhgAAACIIABAAiAAAYAIAACGACAAAhgAAACIIABAAiAAAYAIAACGACAAAhgAAACIIABAAiAAAYAIAACGACAAAhgAAACIIABAAiAAAYAIAACGACAAAhgAAACIIABAAiAAAYAIAACGACAAAhgAAACIIABAAiAAAYAIAACGACAAAhgAAACIIABAAiAAAYAIAACGACAAAhgAAACIIABAAiAAAYAIAACGACAAAhgAAACIIABAAiAAAYAIAACGACAAAhgAAACIIABAAiAAAYAIIB6v9/y4sv/VfhYO/PLG20+Opjz492hfS1uV3+4Xf3hdvWH29Ufbld/ynq7WhgBAwAQAAEMAEAABDAAAAEQwAAABEAAAwAQAAEMAEAABDAAAAEQwAAABEAAAwAQAAEMAEAABDAAAAEQwAAABEAAAwAQAAEMAEAABDAAAAEQwAAABEAAAwAQAAEMAEAA9X6/5fzyRuFj7Zwf77b56GB6/Z7crgS3qz/crv5wu/rD7erPNNyuFkbAAAAEQAADABAAAQwAQAAEMAAAARDAAAAEQAADABAAAQwAQAAEMAAAARDAAAAEQAADABAAAQwAQAAEMAAAARDAAAAEQAADABAAAQwAQAAEMAAAARDAAAAEQAADABBAvd9veX68W/jYqIX4nr3gdvWH29Ufbld/uF394Xb1ZxS3ixEwAAABEMAAAARAAAMAEAABDABAAAQwAAABEMAAAARAAAMAEAABDABAAAQwAAABEMAAAARAAAMAEAABDABAAAQwAAABEMAAAARAAAMAEAABDABAAAQwAAABEMAAAARAAAMAEAABDABAAAQwAAABEMAAAARAAAMAEAABDABAAAQwAAABEMAAAARAAAMAEAABDABAAAQwAAABEMAAAARAAAMAEAABDABAAAQwAAABEMAAAARAAAMAEAABDABAAAQwAAABEMAAAARAAAMAEAABDABAAAQwAAABEMAAAARAAAMAEAABDABAAAQwAAABEMAAAARQH8O39Pbf2Et0di7u/Ny5q1hcQz8cFz4Z1eRnZsUv1CSeWxA/O46n3cj4Pr+wy/wpqouLZkSi2eZ7/XM9+97VRKIoea/XyK75/y51veyi7J+Vj5O31h+9F/ENe/Otv9M/x9fim+/t/+3PV8n7xpVI4yL5vOaX6Xp/7v57AB2M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);
		background-size: contain;
		background-repeat: no-repeat;
	}

	.board-content {
		margin-top: 36rpx;
		margin-left: 22rpx;
	}

	.card-list {
		width: 140rpx;
		height: 250rpx;
		flex: 1;
		align-items: center;
		justify-content: center;
		margin: 10rpx 14rpx;
		box-sizing: border-box;
	}

	.card-img {
		flex-shrink: 0;
		width: 140rpx;
		height: 190rpx;
		display: block;
		border-radius: 8rpx;
		box-shadow: 10rpx 10rpx 6rpx #33333359;
	}

	.card-name {
		padding-top: 10rpx;
		font-size: 30rpx;
		color: black;
		font-weight: 400;
		width: 160rpx;
		text-align: center;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.join-btn {
		height: 114rpx;
		width: 288rpx;
		margin-left: 80rpx;
		display: flex;
		justify-content: center;
		background-image: url(data:image/png;base64,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);
		background-size: 100% 100%;
		background-repeat: no-repeat;
	}

	.history {
		width: 100%;
		height: 850rpx;
		display: flex;
		background-image: url(data:image/png;base64,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);
		background-size: 100% 100%;
		background-repeat: no-repeat;
		margin-bottom: 260rpx;
	}

	.history-list {
		margin-left: 82rpx;
		margin-top: 86rpx;
		height: 680rpx;
		width: 78%;
	}

	.history-item {
		padding: 8rpx 0;
	}

	.his-name {
		font-size: 30rpx;
		font-weight: 800;
		color: #ff6600;
	}

	.his-text {
		font-size: 30rpx;
		color: #333333;
	}

	.his-pos {
		font-size: 30rpx;
		font-weight: 800;
		color: #3366cc;
	}
</style>
