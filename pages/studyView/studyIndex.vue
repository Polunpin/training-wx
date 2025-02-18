<template>
	<view>
		<z-swiper
		  v-model="list"
		  :options="{slidesPerView : 3,centeredSlides : true,centeredSlidesBounds: true}"
		>
		  <z-swiper-item v-for="(item,index) in imgList" :key="index">
		    <image class="image" :src="item.level" mode="aspectFill"> </image>
		  </z-swiper-item>
		</z-swiper>
	</view>
</template>
<!--   <ProgressBar :percentage="30" /> -->
<script>
	import ProgressBar from '@/components/progressBar.vue';
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
	


			}
		},
		computed: {

		},
		onLoad() {
			console.log(this, 'this是啥')
		},
		onLaunch() {
			console.log(this, 'this是啥')
		},
		mounted() {},
		methods: {
			jumpStudyInfo() {

			},



		}
	}
</script>

<style scoped>



</style>