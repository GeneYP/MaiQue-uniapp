<template>
	<view class="about-content flex-col">
		<image class="xp-logo" src="https://pic.gene-yp.com/i/2022/07/22/maiQue.png"></image>
		<text class="xp-title">小屁排卡</text>
		<view class="xp-text flex-col">
			<view class="flex-row" style="align-items: center; margin: 12rpx 0;">
				<tui-icon name="label" size="17" color="#0033FF"></tui-icon>
				<text class="xp-tip"> 介绍</text>
			</view>
			<text style="word-break: break-all;">
				“小屁排卡”（以下简称“本项目”）基于街机游戏“舞萌DX”，免费为线下门店玩家提供排队、游戏信息查询服务。
				本项目所提供的任何信息仅供参考，所有的资料和图象仅以辅助获得信息为目的，均不用于任何商业目的。
				本项目有部分内容来自互联网，若无意中侵犯了某媒体、公司、企业或个人的知识产权，请来电或致函告之，本项目将在规定时间内给予删除等相关处理，若有涉及版权费等问题，请及时提供相关证明等材料并与我们联系，通过友好协商公平公正原则处理纠纷。
				本项目与“からめる”、“神经猫”无任何关系，所用素材来自网络“maimai-special.sega.jp”的“でらっくまメーカー”功能。
				本项目部分数据得益于第三方支持得以实现（详见鸣谢名单）。
			</text>
			<view class="flex-row" style="align-items: center; margin: 12rpx 0;">
				<tui-icon name="like-fill" size="17" color="#FF0000"></tui-icon>
				<text class="xp-tip"> 特别鸣谢</text>
			</view>
			<text>
				Diving-fish、maimai中文维基、全国音游地图
			</text>
			<view class="flex-row" style="align-items: center; margin: 12rpx 0;">
				<tui-icon name="agree" size="17" color="#ff6600"></tui-icon>
				<text class="xp-tip"> 关于作者</text>
			</view>
			<text>
				希望我的项目可以帮到您，您的支持是我维护项目的最大动力！
				如果您喜欢本小程序，请移步至以下网址查看更多内容。 (长按复制)
				
			</text>
			<tui-copy-text value="https://www.gene-yp.com/MaimaiQue.html" color="#586c94">
				https://www.gene-yp.com/MaimaiQue.html
			</tui-copy-text>
			<text style="margin-bottom: 50rpx;">
				
				Project "MaiQue" Powered by GeneYP
				QQ: 2675685357
				©SEGA. All rights reserved.
			</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {

		}
	}
</script>

<style>
	.about-content {
		width: 80%;
		margin-left: 10%;
		align-items: center;
		justify-content: center;
	}

	.xp-logo {
		height: 180rpx;
		width: 180rpx;
		margin-top: 40rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 20rpx;
	}

	.xp-title {
		font-size: 48rpx;
		font-weight: 700;
	}

	.xp-tip {
		margin-left: 8rpx;
		font-size: 34rpx;
		font-weight: 500;
	}

	.xp-text {
		margin-top: 40rpx;
		font-size: 28rpx;
		color: #333;
	}
</style>
