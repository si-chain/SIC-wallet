<!--
****--@file     veisionLog
****--@date     2018/6/20 上午11:09
****--@author   jhd
****--@describe   版本日志
-->
<template>
    <div>
        <x-header :left-options="{backText:''}">{{$t('index.version_log')}}</x-header>
        <div class="version-wrap" v-for="(item,index) in versionData" :key="index">
            <p>V {{item.ver}}</p>
            <ul>
                <li v-for="child in item.msg" :key="child">{{child}}</li>
            </ul>
        </div>
    </div>
</template>
<script>
import { XHeader } from 'vux'
export default {
  components: {
    XHeader
  },
  data () {
    return {
      versionData: []
    }
  },
  created () {
    this.$http.get(`http://sic-client.oss-cn-beijing.aliyuncs.com/version.json?num=${Math.random() * 1000}`).then(data => {
      this.versionData = data.data.version.reverse()
      console.log(this.versionData)
    })
  }
}
</script>
<style lang="less" scoped>
    .version-wrap{
        margin:3.5rem 2rem 0 2rem ;
    }
    p{
        font-size: 1.5rem;
        font-weight: 500;
        line-height: 2;
    }
    ul {
        margin-left: 1rem;
        list-style-type: disc;
        list-style-position: inside;
    }
    .vux-header{
      position: absolute;
      top: 0;
      width: 100%;
    }
</style>
