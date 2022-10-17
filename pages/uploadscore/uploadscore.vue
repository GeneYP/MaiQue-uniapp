<template>
	<view class="content idx-0 flex-col">
		<view class="board-loading idx-100" v-if="refreshing" catchtouchmove="true">
			<tui-loading></tui-loading>
		</view>
		<view class="background idx-1">
			<image class="bg-up" src="../../static/bg_up.png"></image>
			<image class="bg-down-1" src="../../static/bg_down.png"></image>
		</view>
		<view class="tip-bar idx-5">
			<text class="tip-text">我的成绩</text>
		</view>
		<view class="flex-row">
			<view class="tui-drop-input-box idx-6">
				<tui-dropdown-list :show="filterShowLeft" :top="94" :height="400">
					<template v-slot:selectionbox>
						<tui-button type="white" shape="circle" @click="filterLeftList(-1)">{{leftTitle}}
							<view class="tui-animation" :class="[filterShowLeft?'tui-animation-show':'']">
								<tui-icon name="turningdown" :size="20"></tui-icon>
							</view>
						</tui-button>
					</template>
					<template v-slot:dropdownbox>
						<view class="tui-selected-list">
							<scroll-view scroll-y class="tui-dropdown-scroll">
								<block v-for="(item,index) in filterLeftData" :key="index">
									<tui-list-cell padding="0" @click="filterLeftList(index)"
										:unlined="dropdownlistData.length-1==index">
										<view class="tui-cell-class">
											<text class="tui-ml-20">{{item.name}}</text>
										</view>
									</tui-list-cell>
								</block>
							</scroll-view>
						</view>
					</template>
				</tui-dropdown-list>
			</view>
			<view class="tui-drop-input-box idx-6">
				<tui-dropdown-list :show="filterShowRight" :top="94" :height="400">
					<template v-slot:selectionbox>
						<tui-button type="white" shape="circle" @click="filterRightList(-1)">{{rightTitle}}
							<view class="tui-animation" :class="[filterShowRight?'tui-animation-show':'']">
								<tui-icon name="turningdown" :size="20"></tui-icon>
							</view>
						</tui-button>
					</template>
					<template v-slot:dropdownbox>
						<view class="tui-selected-list">
							<scroll-view scroll-y class="tui-dropdown-scroll">
								<block v-for="(item,index) in filterRightData" :key="index">
									<tui-list-cell padding="0" @click="filterRightList(index)"
										:unlined="dropdownlistData.length-1==index">
										<view class="tui-cell-class">
											<text class="tui-ml-20">{{item.name}}</text>
										</view>
									</tui-list-cell>
								</block>
							</scroll-view>
						</view>
					</template>
				</tui-dropdown-list>
			</view>
		</view>
		<view class="song-score idx-5">
			<scroll-view class="score-list idx-5" scroll-y="true">
				<view class="score-item flex-col" v-for="(score, scoreIdx) in scoreList" :key="score.song_id">
					<view class="score-content" @tap="navToMusic(score.song_id)"
						:class="score.level_index==0?'basic-content':score.level_index==1?'advanced-content':score.level_index==2?'expert-content':score.level_index==3?'master-content':'remaster-content'">
						<view class="music-level"
							:style="'background-image: url(https://pic.gene-yp.com/i/2022/07/22/diff_' + score.level_index + '.png);'">
						</view>
						<view class="clearfix"></view>
						<view class="music-lv-block">{{score.ds.toFixed(1)}}</view>
						<view class="music-title">{{score.title}}</view>
						<view class="music-score">{{score.achievements.toFixed(4)}}%</view>
						<view class="music-score">
							<text style="float: left;">DX</text>
							{{score.dxScore}}
						</view>
						<view class="fc-icon"
							:style="'background-image: url(https://pic.gene-yp.com/i/2022/07/22/icon-'+ score.fs +'.png);'">
						</view>
						<view class="fc-icon"
							:style="'background-image: url(https://pic.gene-yp.com/i/2022/07/22/icon-'+ score.fc +'.png);'">
						</view>
						<view class="fc-icon score-icon"
							:style="'background-image: url(https://pic.gene-yp.com/i/2022/07/22/rank-'+ score.rate +'.png);'">
						</view>
					</view>
					<image class="music-kind-icon" :src="'../../static/music_' + score.type + '.png'"></image>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				refreshing: 0,
				leftTitle: 'Best 25',
				rightTitle: '默认',
				filterLeftData: [{
					name: "Best 25",
				}, {
					name: "DX 2022",
				}],
				filterRightData: [{
					name: "降序",
				}, {
					name: "升序",
				}],
				filterShowLeft: false,
				filterShowRight: false,
				b25: [],
				b15: [],
				scoreList: []
			}
		},
		methods: {
			filterLeftList(index) {
				if (index !== -1) {
					this.leftTitle = this.filterLeftData[index].name;
				}
				if (index == 0) {
					this.scoreList = this.b25;
				} else if (index == 1) {
					this.scoreList = this.b15;
				}
				this.filterShowLeft = !this.filterShowLeft
			},
			filterRightList(index) {
				if (index !== -1) {
					this.rightTitle = this.filterRightData[index].name;
				}
				if (index == 0) {
					// 降序
					this.scoreList.sort(function(a, b) {
						return b.ra - a.ra;
					});
				} else if (index == 1) {
					// 升序
					this.scoreList.sort(function(a, b) {
						return a.ra - b.ra;
					});
				}
				this.filterShowRight = !this.filterShowRight
			},
			navToMusic(id) {
				// console.log('跳转到歌曲', id);
				uni.navigateTo({
					url: '../musicdetail/musicdetail?id=' + id
				})
			}
		},
		onLoad() {
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
					if (res.data.rating == null || res.data.rating == '') {
						uni.showToast({
							title: '查分账号错误',
							image: '/static/warning.png',
							duration: 1500
						})
					} else {
						this.b25 = JSON.parse(res.data.b25Score);
						this.b15 = JSON.parse(res.data.b15Score);
					}
				} else {
					uni.showToast({
						title: '请重新登录',
						image: '/static/warning.png',
						duration: 1500
					})
				}
				this.scoreList = this.b25;
				// 降序
				this.scoreList.sort(function(a, b) {
					return b.ra - a.ra;
				});
				this.refreshing = 0;
			})
		}
	}
</script>

<style>
	.tui-drop-input-box {
		width: 400rpx;
		padding: 30rpx 50rpx;
		box-sizing: border-box;
	}

	.score-list {
		height: 83vh;
	}

	.score-item {
		width: 90%;
		left: 5%;
		margin-top: 20rpx;
		padding-bottom: 20rpx;
		display: block;
		position: relative;
	}

	.score-content {
		height: 200rpx;
		position: relative;
		display: block;
		border-radius: 10rpx;
	}

	.basic-content {
		background: url(https://pic.gene-yp.com/i/2022/07/22/bg-basic.png) no-repeat 0 10rpx, #6fe163;
		border: 4rpx solid #000;
		box-shadow: 2rpx 6rpx 0 #025235;
	}

	.advanced-content {
		background: url(https://pic.gene-yp.com/i/2022/07/22/bg-advanced.png) no-repeat 0 10rpx, #f8df3a;
		border: 4rpx solid #c7450c;
		box-shadow: 2rpx 6rpx 0 #c7450c;
	}

	.expert-content {
		background: url(https://pic.gene-yp.com/i/2022/07/22/bg-expert.png) no-repeat 0 10rpx, #ff828e;
		border: 4rpx solid #c02138;
		box-shadow: 2rpx 6rpx 0 #c02138;
	}

	.master-content {
		background: url(https://pic.gene-yp.com/i/2022/07/22/bg-master.png) no-repeat 0 10rpx, #c27ff4;
		border: 4rpx solid #67148d;
		box-shadow: 2rpx 6rpx 0 #67148d;
	}

	.remaster-content {
		background: url(https://pic.gene-yp.com/i/2022/07/22/bg-remaster.png) no-repeat 0 10rpx, #e5ddea;
		border: 4rpx solid #8c2cd5;
		box-shadow: 2rpx 6rpx 0 #8c2cd5;
	}

	.music-level {
		float: left;
		margin-top: 8rpx;
		margin-left: 8rpx;
		height: 40rpx;
		width: 200rpx;
		background-repeat: no-repeat;
		background-size: contain;
	}

	.music-lv-block {
		width: 90rpx;
		height: 86rpx;
		padding: 34rpx 0 0;
		background: url(https://pic.gene-yp.com/i/2022/07/22/music-lv.png);
		background-repeat: no-repeat;
		border-radius: 10rpx;
		position: absolute;
		top: 26rpx;
		right: 8rpx;
		float: right;
		text-align: center;
		font-size: 28rpx;
	}

	.music-title {
		width: 500rpx;
		margin: 10rpx;
		padding: 10rpx 16rpx;
		background: #313131;
		border-radius: 10rpx;
		color: #fff;
		text-align: left;
		font-size: 26rpx;
		word-break: break-all;
		line-height: 1.2rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.music-score {
		height: 32rpx;
		width: 160rpx;
		font-size: 30rpx;
		margin: 10rpx 10rpx 0 10rpx;
		padding: 10rpx;
		background: #ffffffe6;
		border-radius: 10rpx;
		line-height: 30rpx;
		float: left;
		text-align: right;
		white-space: nowrap;
	}

	.fc-icon {
		float: right;
		height: 70rpx;
		width: 70rpx;
		background-repeat: no-repeat;
		background-size: contain;
	}

	.score-icon {
		margin-right: 10rpx;
		margin-top: 10rpx;
		height: 60rpx !important;
		width: 100rpx !important;
	}
</style>
