<!--
****--@file     veisionLog
****--@date     2018/6/20 上午11:09
****--@author   jhd
****--@describe   版本日志
-->
<template>
    <div class="version-box">
        <sic-header :left-options="{backText:''}">{{$t('index.version_log')}}</sic-header>
        <div class="version-wrap" :style="{height:WrapHeight}">
          <div class="version-wrap-line">
            <div class="version-item" v-for="(item,index) in versionData" :key="index">
              <p class="title"><span></span> V{{item.ver}}</p>
              <ul>
                  <li v-for="child in item.msg" :key="child">{{child}}</li>
              </ul>
            </div>
          </div>
        </div>
    </div>
</template>
<script>
import sicHeader from '../components/sicHeader'
export default {
  components: {
    sicHeader
  },
  data () {
    return {
      versionData: [],
      WrapHeight: '100%'
    }
  },
  created () {
    this.$http.get(`http://sic-client.oss-cn-beijing.aliyuncs.com/version.json?num=${Math.random() * 1000}`).then(data => {
      this.versionData = data.data.version.reverse()
    })
    this.WrapHeight = (window.screen.availHeight - 68) / 14 + 'rem'
  }
}
</script>
<style lang="less" scoped>
.version-box{
  overflow: hidden;
  height: 100%;
}
.version-wrap{
  margin-left: 2rem ;
  overflow-y: scroll;
  height: 100%;
}
.version-wrap-line{
  margin-left: 5px;
  border-left: 1px solid #e1e1e1;
}
.version-item{
  margin-left: 2.428571rem;
}
.version-item:first-child{
  padding-top: 1.428571rem;
}
.version-item:last-child {
  padding-bottom: 2rem
}
.title {
  span{
    display: inline-block;
    width: .428571rem;
    height: .428571rem;
    border: 1px solid #e1e1e1;
    background: #e1e1e1;
    margin:0 2.142857rem .285714rem -2.714286rem;
    border-radius: 50%;
  }
}
p{
    font-size: 1.5rem;
    font-weight: 900;
    line-height: 2;
}
ul {
    margin-left: 5px;
    list-style-type: disc;
    color: #999999;
    font-size: @font-size3;
    font-weight: 300;
    line-height: 2rem;
    list-style-position: inside;
}
</style>
