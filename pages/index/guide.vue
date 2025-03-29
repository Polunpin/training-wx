<template>
  <div class="tips-wrap">
    <img :src="imageUrl" alt="Image Resource"/>
  </div>
</template>
<style lang="scss" scoped>
.tips-wrap {
  width: 100%;
  height: 100vh;
  background: #fff;

  img {
    width: 100%;
    display: block;
  }
}
</style>

<script>

import Header from '@/components/header.vue'
import {mapGetters} from "vuex";

export default {
  components: {
    Header
  },
  computed: {
    ...mapGetters(["userinfo"]),
  },
  data() {
    return {
      imageUrl: ''
    }
  },
  mounted() {
    this.getImageUrl();
  },

  methods: {
    // 获取图片资源访问路径
    async getImageUrl() {
      try {
        const res = await this.$cloudService.call({
          path: '/imageResources/getResourceUrlById',
          data: {id: 1}
        });
        this.imageUrl = res?.data || '';
      } catch (error) {
        console.error('Failed to fetch image URL:', error);
      }
    },
  },
}
</script>