<template>
	<view class="study-info-wrap">
		<view class="img">
			<image :src="infoObj.pictures || 'https://pic.rmb.bdstatic.com/bjh/news/341edcdfdf8ba0744d70617cc14d3170.jpeg'" alt="图片" class='imgItem'></image>
		</view>
		<view class="content">
			<view class="tabOne">

				<view class="tabOne-item" v-for="(item,index) in detailKeys" :key="index" @click="pitchIndex=index"
					:class="pitchIndex==index? 'pitch-tabOne' :''">
					{{item}}
				</view>

			</view>
			<view class="info">
				<view class="tabTwo">
					<view class="tabTwo-item " v-for="(item,index) in fourLevel" :key="index"
						@click="picthFourIndex=index" :class="picthFourIndex==index? 'active' :'' ">
						{{item.fourthLevel}}
					</view>

				</view>
				<view class="explain">
					<view class="title">
						讲解
					</view>
					<view class="explain-content">
						{{infoObj.knowledgePoint}}
					</view>
				</view>
				<view class="property">
					<view class="property-item">
						<view class="">
							难度
						</view>
						<uni-rate :readonly="true" :value="infoObj.difficulty" color="#C8DAEC" active-color="#4882C0" />
						<!-- 评分组件 -->
					</view>
					<view class="property-item">
						<view class="">
							类型
						</view>
						<view class="">
							{{infoObj.knowledgeType}}
						</view>
					</view>
					<view class="property-item">
						<view class="">
							场景
						</view>
						<view class="">
							{{infoObj.scenario}}
						</view>
					</view>
					<view class="property-item">
						<view class="">
							重要等级
						</view>
						<view class="">
							{{infoObj.knowledgeType}}
						</view>
					</view>

				</view>


			</view>
		</view>

		<view class="fixed-box">
			<view class="fixed-item one " @click="changeStatus('提问')">
				<image class="icon-tiwen" src="https://7072-prod-1gnzk6n75a8b6b8b-1327385705.tcb.qcloud.la/images/study/icon-tiwen.png?sign=7ace934d2353d335a9a7906d2153ddbd&t=1740974690"></image>
				提问
			</view>
			<view class="fixed-item two  btn" @click="changeStatus('会了')">
				我学会了
			</view>
			<!-- <view class="fixed-item three btn" @click="changeStatus('没懂')">
				<view class="bigText">
					没懂
				</view>
				<view class="smallText">
					先记录下来
				</view>
			</view> -->

		</view>
	</view>
</template>
<!--   -->
<script>
	import {
		get,
		post
	} from "@/utils/request.js";
	export default {
		components: {},
		data() {
			return {
				detail: {},
				pitchIndex: 0,
				picthFourIndex: 0,
			}
		},
		watch: {

		},
		computed: {
			detailKeys() {
				return Object.keys(this.detail)
			},
			//当前选中的 三级
			fourLevel() {
				return this.detail[this.detailKeys[this.pitchIndex]]
			},
			// 当前选中的四级
			infoObj() {
				if (this.fourLevel) {
					return this.fourLevel[this.picthFourIndex]
				} else {
					return {}
				}


			},


		},
		onLoad(option) { //option为object类型，会序列化上个页面传递的参数
			console.log(option, '页面参数'); //打印出上个页面传递的参数。
			if (option.secondLevel) {
				this.getListInfo(option.secondLevel)
			}
		},
		onLaunch() {},
		mounted() {},
		methods: {
			// 知识点详情 接口  	// knowledge/listInfoBySecondLevel  知识点详情 get 
			getListInfo(str) {
				get("/knowledge/listInfoBySecondLevel", {
					// "studentId": "6",
					"secondLevel": str
				}).then((res) => {
					console.log(res, '结果')
					this.detail = res.reduce((pre, cur) => {
						if (!pre[cur['thirdLevel']]) {
							pre[cur['thirdLevel']] = [];
							pre[cur['thirdLevel']].push(cur)
						} else {
							pre[cur['thirdLevel']].push(cur)
						}
						return pre
					}, {})
				});

			},
			changeStatus(status) {
				if (status != '会了') {
					uni.showToast({
						title: `点击了${status}`,
						icon: 'none'
					})
					return
				}
				this.setState(status)
			},
			// 知识状态更新 接口  	// /knowledgeState/updateState  知识状态更新 post
			setState(status) {
				post("/knowledgeState/updateState", {
					"studentId": "6",
					"knowledgeId": this.infoObj.id.toString(),
					id: "12",
					status
				}).then((res) => {
					if (res) {
						uni.showToast({
							title: `学会了`,
							icon: 'none'
						})
						// setTimeout(() => {
						// 	uni.navigateBack()
						// }, 500)
					}
				}).catch(err => {
					// setTimeout(() => {
					// 	uni.navigateBack()
					// }, 500)
				});

			},

			onChange(swiper) {},
			jumpStudyInfo() {

			},
			clickItem(item) {
				this.pitchLevel = item.level
			}
		}
	}
</script>

<style scoped lang="less">
	* {
		margin: 0;
		padding: 0;
		font-family: 'PingFang sc', serif;
	}

	::-webkit-scrollbar {
		display: none;
		/* 隐藏WebKit浏览器的滚动条 */
	}

	/deep/ ::-webkit-scrollbar {
		display: none;
		width: 0;
		height: 0;
		color: transparent;
	}

	/* 兼容Firefox */
	* {
		scrollbar-width: none;
		/* Firefox */
	}

	/* 兼容IE和Edge */
	* {
		-ms-overflow-style: none;
		/* IE和Edge */
	}

	.study-info-wrap {
		height: 100vh;
		overflow: scroll;
	}

	.img {
		width: 100%;
		height: 996rpx;

		.imgItem {
			width: 100%;
			height: 100%;
		}
	}

	.fixed-box {
		position: fixed;
		bottom: 0rpx;
		padding-left: 66rpx;
		padding-right: 66rpx;
		padding-top: 24rpx;
		padding-bottom: calc(24rpx + constant(safe-area-inset-bottom));
    padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
		box-sizing: border-box;
		width: 100%;
		display: flex;
		background: #fff;
		justify-content: center;
		align-items: center;

		.fixed-item {
			height: 100%;
		}

		.btn {
			padding: 20rpx 0;
			width: 260rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #fff;
			font-size: 32rpx;
			font-weight: 500;
		}

		.one {
			margin-right: 50rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			flex-shrink: 0;
			font-size: 24rpx;
			color: #333;
			.icon-tiwen {
				width: 48rpx;
				height: 48rpx;
				margin-bottom: 4rpx;
			}
		}

		.two {
			background-color: rgba(90, 185, 91, 1);
			border-radius: 200rpx;
			width: 100%;
		}

		.three {
			background-color: rgba(240, 119, 108, 1);
			border-radius: 0 10rpx 10rpx 0;
			flex-direction: column;

			.smallText {
				font-size: 8rpx;
				transform: scale(0.8);
			}
		}
	}

	.content {
		.tabOne {
			font-size: 40rpx;
			font-weight: 600;
			display: flex;
			justify-content: flex-start;;
			overflow-y: scroll;
			margin-top: -14rpx;

			.tabOne-item {
				padding: 16rpx 40rpx;
				white-space: nowrap;
				font-size: 28rpx;
				background-color: #F4F4F4;
    		margin-top: 14rpx;
				height: 72rpx;
				box-sizing: border-box;
			}

			.pitch-tabOne {
				height: 86rpx;
				margin-top: 0;
				border-radius: 30rpx 30rpx 0 30rpx;
				padding-top: 26rpx;
				font-size: 34rpx;
				color: #4882C0;
				background-color: #fff;
				position: relative;
				
				// clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 100%, 0 100%);
				&::before {
					content: "";
					position: absolute;
					width: 0;
					height: 0;
					left: -34rpx;
					border-style: solid;
					border-width: 0 0rpx 72rpx 36rpx;
					border-color: transparent transparent #fff transparent;
				}
				&::after {
					content: "";
					position: absolute;
					width: 0;
					height: 0;
					bottom: 0;
					right: -34rpx;
					border-style: solid;
					border-width: 0 36rpx 72rpx 0px;
					border-color: transparent transparent #fff transparent;
				}
				&:first-child {
					border-radius: 0 30rpx 0 0;
					&::before {
						display: none;
					}
				}
				&:last-child {
					border-radius: 30rpx 0 0 0;
					&::after {
						display: none;
					}
				}

			}
		}

		.info {
			padding: 60rpx 26rpx;
			margin: 0 auto;
			padding-bottom: calc(184rpx + constant(safe-area-inset-bottom));
    	padding-bottom: calc(184rpx + env(safe-area-inset-bottom));

			.tabTwo {
				display: flex;
				flex-wrap: wrap;
				/* 以下属性可根据需要调整，用于设置弹性项目之间的间距 */
				gap: 20rpx;
				font-size: 25rpx;

				.tabTwo-item {
					padding: 12rpx 20rpx;
					border: 2rpx solid #F8F8F8;
					background: #F8F8F8;
					color: #1D1E22;
					border-radius: 4rpx;
				}

				.active {
					color: #4882C0;
					border-radius: 4px;
					border: 2rpx solid #4882C0;
					background: rgba(72, 130, 192, 0.10);
				}
			}

			.explain {
				padding: 0 10rpx;
				margin-top: 50rpx;
				.title {
					font-size: 36rpx;
					color: rgba(51, 51, 51, 1);
					font-weight: 600;
					line-height: 60rpx;
				}
			}

			.property {
				padding: 0 10rpx;
				margin-top:64rpx;

				.property-item {
					display: flex;
					align-items: center;
					justify-content: space-between;
					height: 50rpx;
					font-size: 28rpx;
					color: rgba(29, 30, 34, 1);
				}

			}
		}
	}
</style>