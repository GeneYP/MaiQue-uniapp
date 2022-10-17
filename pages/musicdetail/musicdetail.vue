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
			<text class="tip-text">歌曲详情</text>
		</view>
		<view class="song-item flex-col idx-5">
			<view class="song-content flex-row">
				<view class="song-img" :style="'background-image: url(' + song.img + ');'"></view>
				<view class="song-detail">
					<view class="song-title">{{song.title}}</view>
					<view class="song-info">作曲: {{song.basicInfo.artist}}</view>
					<view class="song-info">流派: {{song.basicInfo.genre}}</view>
					<view class="song-info">BPM: {{song.basicInfo.bpm}}</view>
					<view class="song-info">分类: {{song.basicInfo.from}}</view>
				</view>
				<image class="music-kind-icon" :src="'../../static/music_' + song.type + '.png'"></image>
			</view>
		</view>
		<view class="flex-col" style="background-color: #fff; margin-top: 20rpx;">
			<tui-tab :tabs="tab5" :size="30" bold color="#999" @change="change" v-if="hackReset"
				:sliderBgColor="tabIdx == 0 ? '#6fe163' : tabIdx == 1 ? '#f8df3a' : tabIdx == 2 ? '#ff828e' : tabIdx == 3 ? '#c27ff4' : '#e5ddea'"
				:selectedColor="tabIdx == 0 ? '#025235' : tabIdx == 1 ? '#dd691b' : tabIdx == 2 ? '#c02138' : tabIdx == 3 ? '#7817a5' : '#c27ff4' ">
			</tui-tab>
			<view class="flex-row idx-5" style="width: 94%; margin-left: 3%;" v-if="hackReset">
				<view class="ds-info">
					<text class="ds-title">定数</text>
					<text class="ds-text">{{song.ds[tabIdx].toFixed(1)}}</text>
				</view>
				<view class="ds-info">
					<text class="ds-title">谱师</text>
					<text class="ds-text" style="width: 70%;">{{song.charts[tabIdx].charter}}</text>
				</view>
			</view>
			<view class="flex-col idx-5" style="width: 94%; margin-left: 3%;">
				<tui-table class="data-table">
					<tui-tr>
						<tui-td size="25" color="#4762b1" ellipsis bold v-for="(item, index) in header1" :key="index"
							:span="8" backgroundColor="#e1f1f9">
							{{item.title}}
						</tui-td>
					</tui-tr>
					<tui-tr>
						<tui-td :span="8" v-for="(item, index) in chartData1[tabIdx]" :key="index">{{item}}</tui-td>
					</tui-tr>
				</tui-table>
				<tui-table class="data-table">
					<tui-tr>
						<tui-td size="25" color="#4762b1" ellipsis bold v-for="(item, index) in header2" :key="index"
							:span="8" backgroundColor="#e1f1f9">
							{{item.title}}
						</tui-td>
					</tui-tr>
					<tui-tr v-for="(item, index) in chartData2[tabIdx]" :key="index">
						<tui-td :span="8" v-for="(obj, idx) in header2" :key="idx">{{item[obj.key]}}</tui-td>
					</tui-tr>
					<tui-tr>
						<tui-td :span="8">BREAK</tui-td>
						<tui-td :span="8">
							<view class="flex-col">
								<text>{{chartData3[tabIdx][0].great2000}}</text>
								<text>{{chartData3[tabIdx][0].great1500}}</text>
								<text>{{chartData3[tabIdx][0].great1250}}</text>
							</view>
						</tui-td>
						<tui-td :span="8">{{chartData3[tabIdx][0].good}}</tui-td>
						<tui-td :span="8">{{chartData3[tabIdx][0].miss}}</tui-td>
					</tui-tr>
					<tui-tr>
						<tui-td :span="8" bold>50落</tui-td>
						<tui-td :span="8">{{chartData3[tabIdx][0].perfect2550}}</tui-td>
						<tui-td :span="8" bold>100落</tui-td>
						<tui-td :span="8">{{chartData3[tabIdx][0].perfect2500}}</tui-td>
					</tui-tr>
				</tui-table>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				hackReset: false,
				tabIdx: 0,
				tab5: ['Basic', 'Advanced', 'Expert', 'Master', 'Re:Master'],
				song: {
					id: 834,
					title: '',
					type: 'SD',
					ds: [],
					charts: [],
					basicInfo: {},
					img: "https://pic.gene-yp.com/i/2022/07/22/0000.png"
				},
				chartData1: [],
				chartData2: [],
				chartData3: [],
				header1: [{
						title: '物量',
						key: 'total'
					},
					{
						title: 'TAP',
						key: 'tap'
					},
					{
						title: 'HOLD',
						key: 'hold'
					},
					{
						title: 'SLIDE',
						key: 'slide'
					},
					{
						title: 'TOUCH',
						key: 'touch'
					},
					{
						title: 'BREAK',
						key: 'break'
					}
				],
				header2: [{
						title: '减分值',
						key: 'type'
					},
					{
						title: 'GREAT',
						key: 'great'
					},
					{
						title: 'GOOD',
						key: 'good'
					},
					{
						title: 'MISS',
						key: 'miss'
					}
				]
			}
		},
		methods: {
			change(e) {
				this.tabIdx = e.index;
			}
		},
		onLoad(option) {
			// console.log('当前展示', option);
			// 获取单曲信息
			this.$request.request({
				url: '/maique/music/id/' + option.id,
				method: 'GET',
			}).then(res => {
				let img_id = ("000" + res.data.id.toString()).substr(-4);
				let tap = 0;
				let hold = 0;
				let slide = 0;
				let per = 0;
				let per_break = 0;
				this.song.id = res.data.id;
				this.song.title = res.data.title;
				this.song.type = res.data.type;
				this.song.ds = JSON.parse(res.data.ds);
				if (this.song.ds.length == 4) {
					this.tab5.splice(4);
				}
				this.song.basicInfo = JSON.parse(res.data.basicInfo);
				this.song.charts = JSON.parse(res.data.charts);
				for (let i = 0; i < this.song.charts.length; i++) {
					tap = this.song.charts[i].notes[0];
					hold = this.song.charts[i].notes[1];
					slide = this.song.charts[i].notes[2];
					if (this.song.charts[i].notes.length == 4) {
						per = 100 / (tap + hold * 2 + slide * 3 + this.song.charts[i].notes[3] * 5);
						per_break = 1 / this.song.charts[i].notes[3];
						this.chartData1.push({
							total: tap + hold + slide + this.song.charts[i].notes[3],
							tap: tap,
							hold: hold,
							slide: slide,
							touch: 0,
							break: this.song.charts[i].notes[3]
						});
						this.chartData2.push([{
								type: 'TAP',
								great: (per * 0.2).toFixed(4) + '%',
								good: (per * 0.5).toFixed(4) + '%',
								miss: (per * 1).toFixed(4) + '%'
							},
							{
								type: 'HOLD',
								great: (per * 2 * 0.2).toFixed(4) + '%',
								good: (per * 2 * 0.5).toFixed(4) + '%',
								miss: (per * 2 * 1).toFixed(4) + '%'
							},
							{
								type: 'SLIDE',
								great: (per * 3 * 0.2).toFixed(4) + '%',
								good: (per * 3 * 0.5).toFixed(4) + '%',
								miss: (per * 3 * 1).toFixed(4) + '%'
							}
						])
						this.chartData3.push([{
							type: 'BREAK',
							perfect2550: (per_break * 0.25).toFixed(4) + '%',
							perfect2500: (per_break * 0.5).toFixed(4) + '%',
							great2000: (per * 5 * 0.2 + per_break * 0.6).toFixed(4) + '%',
							great1500: (per * 5 * 0.4 + per_break * 0.6).toFixed(4) + '%',
							great1250: (per * 5 * 0.5 + per_break * 0.6).toFixed(4) + '%',
							good: (per * 5 * 0.6 + per_break * 0.7).toFixed(4) + '%',
							miss: (per * 5 * 1 + per_break).toFixed(4) + '%'
						}])
					} else {
						per = 100 / (tap + this.song.charts[i].notes[3] + hold * 2 + slide * 3 + this.song.charts[
							i].notes[4] * 5);
						per_break = 1 / this.song.charts[i].notes[4];
						this.chartData1.push({
							total: tap + hold + slide + this.song.charts[i].notes[3] + this.song.charts[i]
								.notes[4],
							tap: tap,
							hold: hold,
							slide: slide,
							touch: this.song.charts[i].notes[3],
							break: this.song.charts[i].notes[4]
						})
						this.chartData2.push([{
								type: 'TAP',
								great: (per * 0.2).toFixed(4) + '%',
								good: (per * 0.5).toFixed(4) + '%',
								miss: (per * 1).toFixed(4) + '%'
							},
							{
								type: 'HOLD',
								great: (per * 2 * 0.2).toFixed(4) + '%',
								good: (per * 2 * 0.5).toFixed(4) + '%',
								miss: (per * 2 * 1).toFixed(4) + '%'
							},
							{
								type: 'SLIDE',
								great: (per * 3 * 0.2).toFixed(4) + '%',
								good: (per * 3 * 0.5).toFixed(4) + '%',
								miss: (per * 3 * 1).toFixed(4) + '%'
							},
							{
								type: 'TOUCH',
								great: (per * 0.2).toFixed(4) + '%',
								good: (per * 0.5).toFixed(4) + '%',
								miss: (per * 1).toFixed(4) + '%'
							}
						])
						this.chartData3.push([{
							type: 'BREAK',
							perfect2550: (per_break * 0.25).toFixed(4) + '%',
							perfect2500: (per_break * 0.5).toFixed(4) + '%',
							great2000: (per * 5 * 0.2 + per_break * 0.6).toFixed(4) + '%',
							great1500: (per * 5 * 0.4 + per_break * 0.6).toFixed(4) + '%',
							great1250: (per * 5 * 0.5 + per_break * 0.6).toFixed(4) + '%',
							good: (per * 5 * 0.6 + per_break * 0.7).toFixed(4) + '%',
							miss: (per * 5 * 1 + per_break).toFixed(4) + '%'
						}])
					}
				}
				this.song.img = "https://pic.gene-yp.com/i/2022/07/22/" + img_id + ".png";
				this.$nextTick(() => {
					this.hackReset = true;
				})
			});
		}
	}
</script>

<style>
	.ds-info {
		width: 50%;
		height: 48rpx;
		padding: 10rpx;
		margin: 20rpx;
		background: #424242;
		box-shadow: 2rpx 2rpx 0 #0006;
		border-radius: 10rpx;
	}

	.ds-title {
		color: #fff;
		font-size: 32rpx;
		font-weight: 700;
		float: left;
	}

	.ds-text {
		color: #fff;
		font-size: 32rpx;
		float: right;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.data-table {
		margin: 16rpx 0;
		border: 4rpx solid #3e9cf5;
		border-radius: 12rpx;
	}
</style>
