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
			<text class="tip-text">查询结果</text>
		</view>
		<view class="song-res idx-5">
			<scroll-view class="song-list idx-5" scroll-y="true">
				<view class="song-item flex-col" v-for="(song, songIdx) in songList" :key="song.id">
					<view class="song-content flex-row" @tap="navToMusic(song)">
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
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				songList: []
			}
		},
		methods: {
			navToMusic(song) {
				// console.log('正在跳转', song);
				uni.navigateTo({
					url: '../musicdetail/musicdetail?id=' + song.id
				})
			}
		},
		onLoad(option) {
			// console.log(option);
			this.songList = JSON.parse(decodeURIComponent(option.data));;
		}
	}
</script>

<style>
	.song-list {
		margin-top: 20rpx;
		height: 93vh;
	}
</style>
