<template>
	<view class="container" v-if="currentData">
		<view class="bar-box">
			<view class="title" v-if="currentData.state === '待结算' || currentData.state === '已完成'">课后反馈</view>
			<view class="title" v-else>课时记录</view>

			<image src="https://7072-prod-1gnzk6n75a8b6b8b-1327385705.tcb.qcloud.la/images/logo-1.png?sign=ef6ac3a83e1b307000df507c6c26b445&t=1730479792" mode="" class="avatar"></image>
		</view>
		<scroll-view class="scroll-date" scroll-x="true">
			<view class="date-box">
				<view
					class="date-item"
					:class="{ active: index === currentDate }"
					v-for="(item, index) in dataList"
					:key="index"
					@click="selectDate(item, index)"
				>
					<view class="mouth">{{ item.appointmentDateByMonth }}月</view>
					<view class="day">{{ item.appointmentDateByDay }}</view>
				</view>
			</view>
		</scroll-view>
		<view class="trainer" v-if="currentData">
			<image :src="currentData.trainerAvatar" mode="" class="img"></image>
			<view class="text">
				<p style="font-size: 32rpx">{{ currentData.trainerName }}</p>
				<p style="font-size: 24rpx; margin-top: 5rpx">{{ currentData.appointmentTime }}</p>
			</view>
			<view class="gold">陪驾教练</view>
		</view>
		<view v-if="currentData">
			<template v-if="currentData.state === '待结算' || currentData.state === '已完成'">
				<view class="content-box">
					<view class="content-title">{{ currentData.nature }}</view>
					<view class="contetn">本节课学习了：{{ currentData.content }}</view>
				</view>
				<view class="content-box">
					<view class="content-title">教练建议</view>
					<view class="contetn">{{ currentData.proposal }}</view>
				</view>
				<view class="content-box">
					<view class="content-title">我的表现</view>
					<view class="rate-box">
						<view class="rate-item" v-for="(item, index) in currentData.performance" :key="index">
							<view class="item-label">{{ item.title }}</view>
							<uv-rate
								:count="count"
								readonly
								inactive-color="#C2D7FC"
								active-color="#4882C0"
								v-model="item.rate"
							></uv-rate>
						</view>
					</view>
				</view>
			</template>
			<view class="content-box">
				<view class="content-title">接送地址</view>
				<view class="contetn">{{ currentData.address }}</view>
			</view>
			<template v-if="currentData.notes">
				<view class="content-box">
					<view class="content-title">备注</view>
					<view class="contetn">{{ currentData.notes }}</view>
				</view>
			</template>
			<template
				v-if="
					currentData.state === '待分派' || currentData.state === '待反馈' || currentData.state === '待上课'
				"
			>
				<view class="stauts">
					{{ currentData.state }}
				</view>
			</template>
		</view>
	</view>
</template>

<script>
import { get, post } from '@/utils/request.js';
import { mapGetters } from 'vuex';
export default {
	data() {
		return {
			dataList: [], //约课记录
			currentDate: 0,
			// 评论星级
			rateValue: {
				one: 5, //起停车辆
				two: 5, //直行
				three: 5, //转弯
				four: 5, //掉头
				five: 5 //综合车感
			},
			count: 5 //评级个数
		};
	},
	computed: {
		//当前日期预约数据
		currentData() {
			return this.dataList.length > 0 ? this.dataList[this.currentDate] : null;
		},
		...mapGetters(['userinfo'])
	},
	onLoad() {
		this.getFeedback();
	},
	methods: {
		//获取课后反馈信息
		getFeedback() {
			get('/lessonManagement/feedback', {
				studentId: this.userinfo.id
			}).then((res) => {
				res.forEach((item) => {
					if (item.performance) {
						item.performance = JSON.parse(item.performance);
						console.log(item.performance);
					}
				});
				this.dataList = res;
			});
		},
		//选择日期
		selectDate(item, index) {
			this.currentDate = index;
		}
	}
};
</script>

<style lang="scss" scoped>
.container {
	font-family: 'PingFang SC';
	padding: 50rpx 28rpx;
	border-top: 1rpx solid #f5f5f5;

	.stauts {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20vh 0;
		color: #bebebe;
		font-size: 48rpx;
		font-weight: bold;
	}

	.bar-box {
		display: flex;
		align-items: center;
		justify-content: space-between;

		.title {
			color: #000000;
			font-size: 56rpx;
			font-weight: bold;
		}

		.avatar {
			width: 96rpx;
			height: 96rpx;
			border-radius: 24rpx;
			box-shadow: 1px 1px 4px 0 #00000040;
		}
	}

	.scroll-date {
		margin: 30rpx 0;

		.date-box {
			display: flex;
			align-items: center;
			gap: 20rpx;

			.date-item {
				flex: 0 0 120rpx;
				height: 160rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				background: #e9f4f9;
				border-radius: 16rpx;

				&.active {
					background-color: #badff0;
				}

				.mouth {
					color: #000000;
					font-size: 28rpx;
					font-weight: 400;
				}

				.day {
					color: #000000;
					font-size: 40rpx;
					font-weight: bold;
				}
			}
		}
	}

	.trainer {
		position: relative;
		background: #30669f;
		display: flex;
		border-radius: 24rpx;
		padding: 28rpx 0 28rpx 28rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 0 10px 0 rgba(186, 223, 240, 0.6);

		p {
			color: #ffffff;
		}

		.img {
			width: 80rpx;
			height: 80rpx;
			margin-right: 15rpx;
			border-radius: 12%;
		}

		.gold {
			position: absolute;
			right: 0;
			bottom: 0;
			background: #e2bf8b;
			color: #4e3108;
			padding: 6rpx 18rpx;
			font-size: 28rpx;
			font-weight: bold;
			border-radius: 15rpx 0 24rpx 0;
		}
	}

	.content-box {
		padding: 20rpx 25rpx;
		background-color: #ffffff;
		border-radius: 15rpx;
    margin-bottom: 20rpx;
		box-shadow: 0 0 10px 0 #badff099;

		.content-title {
			margin-bottom: 30rpx;
			color: #000000;
			font-size: 32rpx;
			font-weight: 600;
		}

		.info-box {
			font-family: 'PingFang SC';
			display: flex;
			align-items: center;
			padding: 30rpx;
			margin-bottom: 50rpx;
			border-radius: 16rpx;
			background-color: #4076b0;
			box-shadow: 8rpx 8rpx 5rpx rgba(15, 65, 149, 0.3);

			.img {
				width: 64rpx;
				height: 64rpx;
				margin-right: 15rpx;
				border-radius: 50%;
			}

			.text {
				color: #ffffff;
				font-size: 28rpx;
				font-weight: bold;
			}

			.date {
				margin-left: auto;
				color: #dbdbdc;
				font-size: 26rpx;
				font-weight: bold;
			}
		}

		.top {
			margin-top: 30rpx;
		}

		.rate-box {
			display: flex;
			flex-direction: column;
			gap: 20rpx;

			.item-label {
				color: #1d1e22;
				font-size: 28rpx;
				font-weight: 400;
				margin: 15rpx 0;
			}

			.rate-item {
				display: flex;
				align-items: center;
				justify-content: space-between;
			}
		}
		/deep/ .uv-icon__icon {
			font-size: 56rpx !important;
		}
		/deep/ .uvicon-star-fill {
			font-size: 56rpx !important;
		}
		.contetn {
			color: #1d1e22;
			font-size: 28rpx;
			text-align: justify;
			line-height: 1.8;
		}
	}
}
</style>
