<template>
	<view>
		<view class="container">
			<image src="https://7072-prod-1gnzk6n75a8b6b8b-1327385705.tcb.qcloud.la/images/submit-1.png?sign=9f4af2af9d77352da9dd7ca6017e2ab9&t=1730479888" mode="" class="img"></image>
		</view>
		<view class="submit-box">
			<button type="primary" class="btn" @click="submit">好的</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {};
		},
		methods: {
			submit() {
				uni.redirectTo({
					url: "/pages/index/index",
				});
			},
		},
	};
</script>

<style lang="scss">
	.container {
		box-sizing: border-box;
		width: 100%;
		padding: 150rpx 20rpx 0rpx 20rpx;
		display: flex;
		justify-content: center;
		text-align: center;

		.img {
			width: 254px;
			height: 235px;
			flex-shrink: 0;
		}
	}

	.success {
		text-align: center;
	}
.submit-box {
  padding: 20rpx 30rpx;
  z-index: 10;
  position: fixed;
  left: 0;
  right: 0;

  .btn {
    border-radius: 42px;
    background: #4882C0;
  }
}

</style>