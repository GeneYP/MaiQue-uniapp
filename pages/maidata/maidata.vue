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
		<view class="tip-bar idx-5" style="margin-top: 40rpx;">
			<text class="tip-text">关键字查询</text>
		</view>
		<view class="search-bar idx-5 flex-row">
			<view class="search-input">
				<tui-input backgroundColor="#00000000" color="#FFFFFF" @confirm="searchMusic" v-model="keyword"
					placeholder="歌曲名/作曲/谱师/别称/id">
				</tui-input>
			</view>
			<view class="search-btn" @tap="searchMusic"></view>
		</view>
		<view class="tip-bar idx-5">
			<text class="tip-text">条件查询</text>
		</view>
		<view class="info-board flex-col idx-5" style="margin-top: 20rpx;">
			<view class="info-item">
				<text class="name-title" style="white-space: nowrap; margin-top: 38rpx;">等级</text>
				<view class="flex-col" style="width: 75%; margin: 70rpx 0 10rpx;">
					<tui-slider width="240" height="14" radius="16rpx" min="1" max="15" :value="minLv" :endValue="maxLv"
						backgroundColor="linear-gradient(90deg, #00F260,#0575E6)" activeColor="#477A90"
						blockRadius="2px" blockWidth="48" blockShadow="#fff0" section showValue valueColor="#013554"
						boxColor="#FBF9C6" blockColor="#fff0" :valueSize="28" valueFormat="Lv.value" @change="setLevel">
						<template v-slot:start>
							<image src="../../static/left.png" mode="widthFix"></image>
						</template>
						<template v-slot:end>
							<image src="../../static/right.png" mode="widthFix"></image>
						</template>
					</tui-slider>
				</view>
			</view>
			<image class="line" src="../../static/line.png"></image>
			<view class="info-item">
				<text class="name-title">流派</text>
				<view class="name-input flex-col" style="width: 67%; justify-content: center; align-items: center;">
					<view class="pd-min"
						style="margin-top: 2rpx; width: 90%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
						@tap="setGenre">
						{{genre}}
					</view>
				</view>
			</view>
			<image class="line" src="../../static/line.png"></image>
			<view class="info-item">
				<text class="name-title">版本</text>
				<view class="name-input flex-col" style="width: 67%; justify-content: center; align-items: center;">
					<view class="pd-min"
						style="margin-top: 2rpx; width: 90%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
						@tap="setFrom">
						{{from}}
					</view>
				</view>
			</view>
			<image class="line" src="../../static/line.png"></image>
			<view class="info-item">
				<text class="name-title">BPM</text>
				<view class="name-input" style="width: 67%;">
					<view class="pd-min">
						<tui-input backgroundColor="#FFFFFF00" color="#000000" v-model="bpm" type="number"
							placeholder="请输入BPM 默认任意bpm">
						</tui-input>
					</view>
				</view>
			</view>
		</view>
		<view class="board-btn flex-row" style="margin-top: 26rpx; margin-bottom: 260rpx;">
			<view class="move-btn idx-5" @tap="clearTerm">
				<text class="name">清空条件</text>
			</view>
			<view class="quit-btn idx-5" @tap="searchByTerm">
				<text class="name">查询歌曲</text>
			</view>
		</view>
		<view class="idx-100" style="z-index: 9999;">
			<tui-picker :show="showGenre" :pickerData="genreList" @hide="hideGenre" @change="changeGenre">
			</tui-picker>
			<tui-picker :show="showFrom" :pickerData="fromList" @hide="hideFrom" @change="changeFrom">
			</tui-picker>
		</view>
		<tui-tabbar :current="tabIdx" backdropFilter backgroundColor="#333333" :tabBar="tabBar" color="#e6e6e6"
			selectedColor="#ffffff" @click="tabbarSwitch"></tui-tabbar>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabIdx: 0,
				keyword: '',
				minLv: 1,
				maxLv: 15,
				bpm: '',
				showFrom: false,
				showGenre: false,
				from: '任意版本',
				genre: '任意流派',
				genreList: [{
					text: "maimai",
					value: "maimai"
				}, {
					text: "niconicoボーカロイド",
					value: "niconicoボーカロイド"
				}, {
					text: "POPSアニメ",
					value: "POPSアニメ"
				}, {
					text: "オンゲキCHUNITHM",
					value: "オンゲキCHUNITHM"
				}, {
					text: "ゲームバラエティ",
					value: "ゲームバラエティ"
				}, {
					text: "東方Project",
					value: "東方Project"
				}],
				fromList: [{
					text: "maimai",
					value: "maimai"
				}, {
					text: "maimai PLUS",
					value: "maimai PLUS"
				}, {
					text: "maimai GreeN",
					value: "maimai GreeN"
				}, {
					text: "maimai GreeN PLUS",
					value: "maimai GreeN PLUS"
				}, {
					text: "maimai ORANGE",
					value: "maimai ORANGE"
				}, {
					text: "maimai ORANGE PLUS",
					value: "maimai ORANGE PLUS"
				}, {
					text: "maimai PiNK",
					value: "maimai PiNK"
				}, {
					text: "maimai PiNK PLUS",
					value: "maimai PiNK PLUS"
				}, {
					text: "maimai MURASAKi",
					value: "maimai MURASAKi"
				}, {
					text: "maimai MURASAKi PLUS",
					value: "maimai MURASAKi PLUS"
				}, {
					text: "maimai MiLK",
					value: "maimai MiLK"
				}, {
					text: "MiLK PLUS",
					value: "MiLK PLUS"
				}, {
					text: "maimai FiNALE",
					value: "maimai FiNALE"
				}, {
					text: "maimai でらっくす",
					value: "maimai でらっくす"
				}, {
					text: "maimai でらっくす Splash",
					value: "maimai でらっくす Splash"
				}, {
					text: "maimai でらっくす Splash PLUS",
					value: "maimai でらっくす Splash PLUS"
				}],
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
				songList: []
			}
		},
		onLoad() {
			uni.hideTabBar({
				animation: false
			})
		},
		onShow() {
			uni.hideTabBar({
				animation: false
			})
			this.tabIdx = 0;
		},
		methods: {
			tabbarSwitch(e) {
				this.tabIdx = e.index;
				uni.switchTab({
					url: e.pagePath
				})
			},
			searchMusic() {
				// console.log('正在搜索', this.keyword);
				// 请求后端，模糊搜索名字
				this.$request.request({
					url: '/maique/music/name/' + this.keyword,
					method: 'GET',
				}).then(res => {
					// console.log(res);
					let data = [];
					for (let i = 0; i < res.data.length; i++) {
						data.push({
							id: res.data[i].id,
							title: res.data[i].title,
							type: res.data[i].type,
							ds: JSON.parse(res.data[i].ds),
							charts: JSON.parse(res.data[i].charts),
							basicInfo: JSON.parse(res.data[i].basicInfo),
							img: "https://pic.gene-yp.com/i/2022/07/22/" + ("000" + res.data[i].id
								.toString()).substr(-4) + ".png"
						})
					}
					this.songList = data;
					uni.navigateTo({
						url: '../musicResult/musicResult?data=' + encodeURIComponent(JSON.stringify(data))
					})
				})
			},
			setLevel(e) {
				this.minLv = e.value;
				this.maxLv = e.endValue;
			},
			setGenre() {
				this.showGenre = true;
			},
			setFrom() {
				this.showFrom = true;
			},
			hideGenre() {
				this.showGenre = false;
			},
			hideFrom() {
				this.showFrom = false;
			},
			changeGenre(e) {
				this.genre = e.result;
				this.showGenre = false;
			},
			changeFrom(e) {
				this.from = e.result;
				this.showFrom = false;
			},
			clearTerm() {
				this.minLv = 1;
				this.maxLv = 15;
				this.genre = '任意流派';
				this.from = '任意版本';
				this.bpm = '';
			},
			searchByTerm() {
				// 请求后端，模糊搜索名字
				let bpm = this.bpm;
				if (bpm == null || bpm == '') {
					bpm = -1;
				}
				this.$request.request({
					url: '/maique/music/term/' + this.minLv + '/' + (this.maxLv + 0.9) + '/' + this.genre + '/' + this.from + '/' +
						bpm,
					method: 'GET',
				}).then(res => {
					// console.log(res);
					let data = [];
					for (let i = 0; i < res.data.length; i++) {
						data.push({
							id: res.data[i].id,
							title: res.data[i].title,
							type: res.data[i].type,
							ds: JSON.parse(res.data[i].ds),
							charts: JSON.parse(res.data[i].charts),
							basicInfo: JSON.parse(res.data[i].basicInfo),
							img: "https://pic.gene-yp.com/i/2022/07/22/" + ("000" + res.data[i].id
								.toString()).substr(-4) + ".png"
						})
					}
					this.songList = data;
					uni.navigateTo({
						url: '../musicResult/musicResult?data=' + encodeURIComponent(JSON.stringify(data))
					})
				})
			}
		}
	}
</script>

<style>
	.song-list {
		height: 63vh;
	}
</style>
