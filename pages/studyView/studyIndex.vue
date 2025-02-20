<template>
	<view class="body">
		<view class="swiper-box">
			<z-swiper v-model="imgList" class="swiper-box"
				:options="{slidesPerView : 3,centeredSlides : true,centeredSlidesBounds: true,}" @slideChange="onChange">
				<!-- 	 loop : true -->
				<z-swiper-item v-for="(item,index) in imgList" :key="index" :class="pitchLevel==item.level? 'bigImg' :''"
					class="swiper-item" :ref="item.level" @click="clickItem(item)">
					<!-- mode="aspectFill" -->
					<view class="swiper-item" :class="pitchLevel==item.level? 'bigImg' :''">
						<image class="image" :src="item.imgUrl"> </image>
					</view>
				</z-swiper-item>
			</z-swiper>
		</view>
		<!-- 目录 -->
		<view class="catalog">
			<view class="title">
				目录
			</view>
			<view class="content-box" v-if="list.length!=0">
				<view class="content-item" v-for="(item,index) in list" :key="index"
					@click="jumpStudyInfo(item.secondLevel)">
					<view class="index">
						{{index+1}}
					</view>
					<view class="mesage">
						<view class="text">
							{{item.secondLevel}}
						</view>
						<ProgressBar :percentage="item.per" :text='item.text' :color="color" />

					</view>
				</view>
			</view>
			<view class="content-box" v-else>
				暂无数据
			</view>


		</view>

	</view>
</template>
<!--   -->
<script>
	import ProgressBar from '@/components/progressBar.vue';
	import {
		get,
		post
	} from "@/utils/request.js";
	export default {
		components: {
			ProgressBar,
		},
		data() {
			return {
				imgList: [{
						level: '基础',
						imgUrl: '/static/images/基础.png',
						color: '#DBF3FD'
					},
					{
						level: '初级',
						imgUrl: '/static/images/初级.png',
						color: '#CAE9E0'
					},
					{
						level: '中级',
						imgUrl: '/static/images/中级.png',
						color: '#FFDCBA'
					},
					{
						level: '高级',
						imgUrl: '/static/images/高级.png',
						color: '#D7D4E5'
					},

				],
				pitchLevel: '基础',
				list: [],
				studentId: '6',
			}
		},
		watch: {
			pitchLevel(val) {
				this.getKnowledge(val)
			}
		},
		computed: {
			color() {
				return this.imgList.find(item => item.level == this.pitchLevel).color
			},
		},
		onLoad() {},
		onShow() {
			this.getKnowledge(this.pitchLevel)
		},
		onLaunch() {},
		mounted() {
			this.getKnowledge(this.pitchLevel)
		},
		methods: {
			// 学习模块 接口  // knowledge/knowledgeListByFirst   学习模块 post
			getKnowledge(pitchLevel) {
				let that = this
				post("/knowledge/knowledgeListByFirst", {
					"studentId": that.studentId,
					"firstLevel": pitchLevel
				}).then((res) => {
					this.list = res.knowledgeList.map(item => {
						item.text = item.learnCount + '/' + item.knowledgeSum
						item.per = Math.floor((item.learnCount / item.knowledgeSum) * 100)
						return item
					})
				});

			},
			checkout() {
				let that=this
				let keyMap = {
					"基础": '',
					"初级": '基础',
					"中级": '初级',
					"高级": '中级'
				}
				if (keyMap[this.pitchLevel] == '') {
					return true
				}
				return Promise((resolve, reject) => {
					post("/knowledge/knowledgeListByFirst", {
						"studentId": that.studentId,
						"firstLevel": pitchLevel
					}).then((res) => {
						resolve(res.every((item)=>{
							return item.knowledgeSum==item.learnCount
						})) 
	
					});

				})



			},
			onChange(swiper) {},
			async jumpStudyInfo(str) {
				if (await !this.checkout()) {
					uni.showToast({
						title: '请先完成上一阶段练习',
						icon: 'none'
					})
					return
				}
				uni.navigateTo({
					url: `/pages/studyView/studyInfo?secondLevel=${str}`,
				});

			},
			clickItem(item) {
				this.pitchLevel = item.level
			}
		}
	}
</script>

<style scoped lang="less">
	.body{
		min-height: 100vh;
	}
	.swiper-box {
		margin-top: 110rpx;
		height: 300rpx;
		
	}

	.swiper-item {
		display: flex;
		justify-content: center;
		height: 300rpx;
		align-items: center;
	}

	.bigImg {
		.image {
			transform: scale(1.5);
		}
	}

	.image {
		height: 200rpx;
		width: 60%;
	}

	.catalog {
		margin-top: 40rpx;
		padding: 0 40rpx;

		.title {
			font-size: 56rpx;
			font-weight: 700;
			height: 100rpx;
			line-height: 100rpx;
			margin-bottom: 40rpx;
		}

		.content-item {
			display: flex;
			align-items: center;
			height: 130rpx;
			margin-bottom: 30rpx;

			.index {
				width: 80rpx;
				height: 80rpx;
				border-radius: 16rpx;
				background-color: #CAE9E0;
				color: '#FFFFFF';
				text-align: center;
				line-height: 80rpx;
				margin-right: 40rpx;
			}

			.mesage {
				border-bottom: 2rpx solid #F2F2F2;
				height: 100%;
				display: flex;
				flex-direction: column;
				justify-content: space-evenly;
				width: 70%;

				.text {
					font-size: 40rpx;
					line-height: 56rpx;
				}


			}

		}

	}
</style>