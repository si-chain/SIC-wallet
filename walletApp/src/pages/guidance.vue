<template>
  <div class="guidance">
    <swiper ref="swiper" :list="guidanceList" :aspect-ratio="1" v-model="guidanceIndex" @on-index-change="guidanceOnIndexChange"></swiper>
    <div style="text-align:center" class="check-box" v-if="guidanceIndex === 2">
        <check-icon :value.sync="checked" type="plain"> <a style="color:#ffffff;font-weight: 300;" href="#/agreement">我已阅读并同意SIC协议</a></check-icon>
      </div>
    <box gap="9% 9%" class="btn-box" v-if="guidanceIndex === 2">
      <x-button :disabled="!checked" plain type="primary" link="/" style="border-radius:99px;">{{$t('index.start')}}</x-button>
    </box>
  </div>
</template>

<script>
import { CheckIcon, Swiper, SwiperItem, Box, XButton } from 'vux'
export default {
  data () {
    return {
      checked: true,
      guidanceList: [{
        url: 'javascript:',
        img: 'https://ww1.sinaimg.cn/large/663d3650gy1fq66vvsr72j20p00gogo2.jpg',
        title: '送你一朵fua'
      }, {
        url: 'javascript:',
        img: 'https://ww1.sinaimg.cn/large/663d3650gy1fq66vw1k2wj20p00goq7n.jpg',
        title: '送你一辆车'
      }, {
        url: 'javascript:',
        img: 'https://static.vux.li/demo/5.jpg', // 404
        title: '送你一次旅行',
        fallbackImg: 'https://ww1.sinaimg.cn/large/663d3650gy1fq66vw50iwj20ff0aaaci.jpg'
      }],
      guidanceIndex: 0
    }
  },
  components: {
    CheckIcon,
    Swiper,
    SwiperItem,
    Box,
    XButton
  },
  methods: {
    guidanceOnIndexChange (index) {
      this.guidanceIndex = index
    }
  },
  mounted () {
    this.$nextTick(function () {
      this.$refs.swiper.xheight = '100%'
    })
  },
  watch: {
    // guidanceIndex (val) {
    //   alert('val1: ' + val)
    // }
  }
}
</script>

<style lang="less" scoped>
.weui-tab__panel{
  padding-bottom:0px!important
}
.guidance{
  height: 100%;
  .vux-slider{
    height: 100%;
  }
}
.guidance-item{
  width: 100%;
  height: 100%;
  float: left;
}
.btn-box{
  position: absolute;
  bottom: 10%;
  width: 80%;
  text-align: center
}
.check-box{
  position: absolute;
  bottom: 24%;
  width: 100%;
  color: #ffffff;
  text-align: center
}
</style>
