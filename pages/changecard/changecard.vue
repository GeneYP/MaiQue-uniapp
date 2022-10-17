<template>
	<view class="content idx-0 flex-col">
		<view class="background idx-1">
			<image class="bg-up" src="../../static/bg_up.png"></image>
			<image class="bg-down-1" src="../../static/bg_down.png"></image>
		</view>
		<view class="tip-bar idx-5">
			<text class="tip-text">更换卡片</text>
		</view>
		<tui-modal :show="confirm" title="提示" :content="'确定使用' + cardName + '吗？'" :maskClosable="true"
			@click="confirmCard" @cancel="hideConfirm"></tui-modal>
		<view class="card-shop flex-col idx-5">
			<view>
				<tui-grid unlined>
					<block v-for="(card, cardIdx) in cardShopList" :key="card.id">
						<tui-grid-item :cell="3" :bottomLine="false" :border="false" backgroundColor="#0000"
							:hover="false">
							<view class="cs-item flex-col">
								<view v-if="card.id == isUsed" class="mask">
									当前使用
								</view>
								<image class="cs-img" :src="card.img" @click="chooseCard(card.id)"></image>
								<text class="cs-text">{{card.title}}</text>
							</view>
						</tui-grid-item>
					</block>
				</tui-grid>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isUsed: 0,
				isChoosed: -1,
				confirm: false,
				cardName: '',
				cardShopList: [
					{
						id: 0,
						title: '找歪皮定制',
						img: '/static/nocard.png'
					},
					{
						id: 1,
						title: '迪拉熊',
						img: 'https://pic.gene-yp.com/i/2022/07/22/mai-dila.png'
					},
					{
						id: 2,
						title: '柠檬熊',
						img: 'https://pic.gene-yp.com/i/2022/07/22/mai-lime.png'
					},
					{
						id: 3,
						title: 'しゃま',
						img: 'https://pic.gene-yp.com/i/2022/07/22/mai-shama.png'
					},
					{
						id: 4,
						title: 'みるく',
						img: 'https://pic.gene-yp.com/i/2022/07/22/mai-milk.png'
					},
					{
						id: 5,
						title: 'ラズ',
						img: 'https://pic.gene-yp.com/i/2022/07/22/mai-mumei.png'
					},
					{
						id: 6,
						title: 'シフォン',
						img: 'https://pic.gene-yp.com/i/2022/07/22/mai-chiffon.png'
					},
					{
						id: 7,
						title: 'ソルト',
						img: 'https://pic.gene-yp.com/i/2022/07/22/mai-salt.png'
					},
					{
						id: 8,
						title: '乙姫',
						img: 'https://pic.gene-yp.com/i/2022/07/22/mai-yiji.png'
					},
					{
						id: 9,
						title: '舞萌大陆',
						img: 'https://pic.gene-yp.com/i/2022/07/22/mai-normal.png'
					},
					{
						id: 10,
						title: '天界区域',
						img: 'https://pic.gene-yp.com/i/2022/07/22/mai-sky.png'
					},
					{
						id: 11,
						title: '碳酸乐园',
						img: 'https://pic.gene-yp.com/i/2022/07/22/mai-splash.png'
					}
				]
			}
		},
		methods: {
			chooseCard(id) {
				this.confirm = true;
				this.cardName = this.cardShopList[id].title;
				this.isChoosed = id;
			},
			confirmCard(e) {
				let index = e.index;
				this.confirm = false;
				// 0(取消) 1(确认)
				if (index != 0) {
					this.isUsed = this.isChoosed;
					let img = this.cardShopList[this.isUsed].img;
					this.$request.request({
						url: '/maique/user/updateCard',
						data: {
							"cardImg": img
						},
						method: 'POST',
					}).then(res => {
						// console.log('更新卡背信息:', res);
						if (res.code == 200) {
							uni.setStorageSync("cardImg", img);
							uni.setStorageSync("cardIdx", this.isUsed);
						}
					})
				}
			},
			hideConfirm() {
				this.confirm = false;
			}
		},
		onShow() {
			let cardIdx = uni.getStorageSync("cardIdx");
			let cardImg = uni.getStorageSync("cardImg");
			this.cardShopList[0].img = cardImg;
			this.isUsed = cardIdx;
		}
	}
</script>

<style>
	.cs-item {
		justify-content: center;
		align-items: center;
	}

	.cs-img {
		width: 196rpx;
		height: 266rpx;
		border-radius: 12rpx;
		box-shadow: 10rpx 10rpx 6rpx #33333359;
	}

	.cs-text {
		color: #fff;
		text-shadow: 2rpx 2rpx 2rpx #000000;
		font-weight: 500;
		padding-top: 18rpx;
		font-size: 30rpx;
	}

	.mask {
		position: absolute;
		z-index: 10;
		left: 8rpx;
		top: 0;
		width: 198rpx;
		height: 266rpx;
		border-radius: 12rpx;
		background-color: #00000088;
		display: flex;
		color: #FFF;
		font-weight: 500;
		justify-content: center;
		align-items: center;
	}
</style>
