<template>
	<view>
		<view class="img">
			<image :src='infoObj.pictures' alt="图片" class='imgItem'></image>
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
					<view class="tabTwo-item " v-for="(item,index) in fourLevel" :key="index" @click="picthFourIndex=index" :class="picthFourIndex==index? 'pitch-tabTwo' :'' ">
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
				<uni-icons type="chatboxes-filled" size="30" color="#FDF1B8"></uni-icons>
				提问
			</view>
			<view class="fixed-item two  btn" @click="changeStatus('会了')">
				会了
			</view>
			<view class="fixed-item three btn" @click="changeStatus('没懂')" >
				<view class="bigText">
					没懂
				</view>
				<view class="smallText">
					先记录下来
				</view>
			</view>

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
				picthFourIndex:0,
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
			infoObj(){
				if(this.fourLevel){
					return this.fourLevel[this.picthFourIndex]
				}else{
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
			changeStatus(status){
				if(status!='会了'){
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
					if(res){
						uni.showToast({
							title: `学会了`,
							icon: 'none'
						})
						setTimeout(()=>{
							uni.navigateBack()
						},500)
					}
				}).catch(err=>{
					setTimeout(()=>{
						uni.navigateBack()
					},500)
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
	}

	::-webkit-scrollbar {
		display: none;
		/* 隐藏WebKit浏览器的滚动条 */
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

	.img {
		width: 100%;
		height: 600rpx;

		.imgItem {
			width: 100%;
			height: 100%;
		}
	}

	.fixed-box {
		position: fixed;
		bottom: 20rpx;
		height: 90rpx;
		width: 100%;
		display: flex;
		justify-content: center;

		.fixed-item {
			height: 100%;
		}

		.btn {
			height: 100%;
			width: 260rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #fff;
			font-size: 32rpx;
			font-weight: 500;
		}

		.one {
			margin-right: 15rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			color: #FDF1B8;


		}

		.two {
			background-color: rgba(90, 185, 91, 1);
			border-radius: 5rpx 0 0 5rpx;
		}

		.three {
			background-color: rgba(240, 119, 108, 1);
			border-radius: 0 5rpx 5rpx 0;
			flex-direction: column;

			.smallText {
				font-size: 8rpx;
				transform: scale(0.8);
			}
		}
	}

	.content {
		.tabOne {
			height: 75rpx;
			font-size: 40rpx;
			display: flex;
			justify-content: flex-start;
			background-color: #F4F4F4;
			padding: 0 10rpx;
			overflow-y: scroll;

			.tabOne-item {
				padding: 0 20rpx;
				line-height: 75rpx;
				white-space: nowrap;
				font-size: 30rpx;
			}

			.pitch-tabOne {
				background-color: #fff;
				clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 100%, 0 100%);

			}
		}

		.info {
			padding-top: 90rpx;
			width: 95%;
			margin: 0 auto;
			margin-bottom: 150rpx;

			.tabTwo {
				display: flex;
				flex-wrap: wrap;
				padding-bottom: 60rpx;
				/* 以下属性可根据需要调整，用于设置弹性项目之间的间距 */
				gap: 20rpx;

				.tabTwo-item {
					padding: 0 10rpx;
					height: 60rpx;
					line-height: 60rpx;
					border: 2rpx solid #EEEEEE;
					color: #929292;
					border-radius: 6rpx;
				}

				.pitch-tabTwo {
					border: 2rpx solid #4882C0;
					color: black;
				}
			}

			.explain {
				padding: 30rpx;
				box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
				margin-bottom: 60rpx;

				.title {
					font-size: 36rpx;
					color: rgba(51, 51, 51, 1);
					font-weight: 600;
					line-height: 60rpx;
				}
			}

			.property {
				padding: 0 30rpx;

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