<template>
  <div class="guidance">
    <swiper ref="swiper" :list="guidanceList" :aspect-ratio="1" v-model="guidanceIndex" @on-index-change="guidanceOnIndexChange"></swiper>
    <div style="text-align:center" class="check-box" v-if="guidanceIndex === 1">
        <check-icon :value.sync="checked" type="plain"> <a style="color:#ffffff;font-weight: 300;" href="#/agreement">我已阅读并同意SIC协议</a></check-icon>
      </div>
    <box gap="9% 30%" class="btn-box" v-if="guidanceIndex === 1">
      <x-button :disabled="!checked" plain link="/" style="border-radius:99px;font-size:13px">{{$t('index.start')}}</x-button>
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
        img: 'static/image/sic1.png',
        title: ''
      }, {
        url: 'javascript:',
        img: 'static/image/sic.png',
        title: ''
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
  bottom: 7%;
  width: 40%;
  text-align: center
}
.check-box{
  position: absolute;
  bottom: 21%;
  width: 100%;
  color: #ffffff;
  text-align: center
}
.weui-btn_plain-default {
    color: #fff;
    border: 1px solid #FFF;
}
</style>
