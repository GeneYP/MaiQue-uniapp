<template>
	<view class="content idx-0 flex-col">
		<view class="board-loading idx-100" v-if="refreshing" catchtouchmove="true">
			<tui-loading></tui-loading>
		</view>
		<view class="background idx-1">
			<image class="bg-up" src="../../static/bg_up.png"></image>
			<image class="bg-down-1" src="../../static/bg_down.png"></image>
		</view>
		<view class="tip-bar idx-5 mg-top">
			<text class="tip-text">搜索机厅</text>
		</view>
		<view class="search-bar idx-5 flex-row">
			<view class="search-input">
				<tui-input backgroundColor="#00000000" color="#FFFFFF" @confirm="searchShop" v-model="keyword">
				</tui-input>
			</view>
			<view class="search-btn" @tap="searchShop"></view>
		</view>
		<view class="search-res">
			<scroll-view class="res-list idx-5" scroll-y="true">
				<view v-for="(shop, shopIdx) in shopList" :key="shop.id">
					<view class="res-item idx-5 flex-col" @tap="chooseGame(shopList[shopIdx])">
						<text class="shop-name">{{shop.name}}</text>
						<text class="shop-addr">{{shop.address}}</text>
						<text class="shop-num">机台数量：{{shop.num}}</text>
					</view>
				</view>
			</scroll-view>
		</view>
		<tui-drawer mode="bottom" :visible="ifShow">
			<view class="flex-col">
				<text class="dr-title">请选择机台</text>
				<tui-grid>
					<block v-for="(game, gameIdx) in gameList" :key="game.id">
						<tui-grid-item :cell="4" @click="backToHome(game.id)">
							<view class="game-item flex-col">
								<image class="game-img" src="../../static/machine.png"></image>
								<text class="game-text">{{game.id}} 号机</text>
							</view>
						</tui-grid-item>
					</block>
				</tui-grid>
			</view>
			<view class="quit-btn idx-5 mg-le" @tap="quit" style="margin-left: 230rpx;">
				<text class="name">取 消</text>
			</view>
		</tui-drawer>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				lat: '',
				lng: '',
				shopList: [],
				keyword: '',
				ifShow: 0,
				gameList: []
			}
		},
		onLoad() {
			// 获取定位，带经纬度请求数据库，返回附近机厅
			// 获取用户所在位置
			var that = this;
			uni.getLocation({
				type: 'wgs84',
				success: res => {
					// console.log('locationres::', res);
					that.lat = res.latitude;
					that.lng = res.longitude;
					// 请求后端，模糊搜索名字
					that.$request.request({
						url: '/maique/shop/around',
						data: {
							"lng": this.lng,
							"lat": this.lat
						},
						method: 'POST',
					}).then(res => {
						console.log(res);
						let data = [];
						for (let i = 0; i < res.data.length; i++) {
							data.push({
								id: res.data[i].id,
								name: res.data[i].name,
								address: res.data[i].address,
								num: res.data[i].num
							})
						}
						that.shopList = data;
					})
				}
			})
		},
		methods: {
			searchShop() {
				// 请求后端，模糊搜索名字
				this.$request.request({
					url: '/maique/shop/name/' + this.keyword,
					method: 'GET',
				}).then(res => {
					// console.log(res);
					let data = [];
					for (let i = 0; i < res.data.length; i++) {
						data.push({
							id: res.data[i].id,
							name: res.data[i].name,
							address: res.data[i].address,
							num: res.data[i].num
						})
					}
					this.shopList = data;
				})
			},
			chooseGame(shop) {
				// console.log(shop);
				uni.setStorageSync('shopName', shop.name);
				uni.setStorageSync('shopId', shop.id);
				for (let i = 0; i < shop.num; i++) {
					this.gameList.push({
						id: i + 1
					})
				}
				this.ifShow = 1;
			},
			backToHome(gameId) {
				uni.setStorageSync('gameId', gameId);
				uni.navigateBack({
					delta: 1
				})
			},
			quit() {
				this.ifShow = 0;
				this.gameList = [];
			}
		}
	}
</script>

<style>
	.mg-top {
		margin-top: 120rpx;
	}

	.bg-down-1 {
		position: fixed;
		bottom: 0rpx;
		right: 0rpx;
		height: 200rpx;
		width: 200rpx;
	}

	.search-res {
		width: 100%;
		height: 100vh;
		background-color: #57c0ff;
		margin-top: 16rpx;
	}

	.res-list {
		height: 100%;
		width: 100%;
	}

	.res-item {
		width: 84%;
		height: 220rpx;
		margin: 28rpx 8%;
		border-radius: 20rpx;
		background-color: #FFFFFF;
		-moz-box-shadow: 10rpx 10rpx 6rpx #33333359;
		-webkit-box-shadow: 10rpx 10rpx 6rpx #33333359;
		box-shadow: 10rpx 10rpx 6rpx #33333359;
	}

	.shop-name {
		width: 90%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		font-size: 40rpx;
		color: #000000;
		font-weight: 700;
		padding: 32rpx 34rpx 0 34rpx;
	}

	.shop-addr {
		font-size: 22rpx;
		color: #666666;
		padding: 2rpx 34rpx;
	}

	.shop-num {
		font-size: 24rpx;
		font-weight: 500;
		color: #ff6600DF;
		padding: 2rpx 34rpx;
	}

	.dr-title {
		font-size: 40rpx;
		font-weight: 600;
		padding: 26rpx;
	}

	.game-item {
		justify-content: center;
		align-items: center;
	}

	.game-img {
		width: 148rpx;
		height: 123rpx;
	}

	.game-text {
		color: #333333;
		padding-top: 12rpx;
		font-size: 30rpx;
	}
</style>
