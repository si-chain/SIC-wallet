<template>
    <div>
      <sic-header :left-options="option">{{$t('left_panel.about')}}</sic-header>
      <div class="logo-wrap">
        <img class="logo" src="../assets/createlogo.png" alt="">
        <p>智宝钱包</p>
      </div>
      <group>
        <cell class="cell-border-top" title="版本日志" is-link :link="`/version-log?account=${this.$store.state.account}`">
        </cell>
        <cell class="has-before cell-border-bottom" title="版本检测"  @click.native="checkUpdata">
        </cell>
      </group>
      <div class="footer">
        <p class="footer-tip">SIC Foundation</p>
      </div>
      <div v-transfer-dom>
        <confirm
        v-model="showUpdateShow"
        :close-on-confirm="true"
        title="版本更新">
          <p style="text-align:center;">已经是最新版</p>
        </confirm>
      </div>
    </div>
</template>
<script>
import sicHeader from '../components/sicHeader'
import { Group, Cell, Confirm, TransferDom } from 'vux'
import AppConfig from '../libs/config'
export default {
  directives: {
    TransferDom
  },
  components: {
    sicHeader,
    Group,
    Cell,
    Confirm
  },
  data () {
    return {
      option: {
        backText: ''
      },
      isVersions: AppConfig.versions,
      serverAppVersion: '',
      showUpdateShow: false
    }
  },
  methods: {
    checkUpdata () {
      this.$http.get(`http://sic-client.oss-cn-beijing.aliyuncs.com/version.json?num=${Math.random() * 1000}`).then(data => {
        data = data.data
        this.serverAppVersion = data.version[data.version.length - 1].ver
        this.AppUpDataUrl = data.version[data.version.length - 1].url
        if (this.isVersions !== this.serverAppVersion) {
          window.location.href = data.version[data.version.length - 1].url
        } else {
          this.showUpdateShow = true
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.logo-wrap{
  text-align:center;
  margin-top: 2.0rem;
  p{
    font-size: 1.285714rem;
    color: #999999;
    font-weight: 300;
    line-height: 4rem;
  }
}
.logo{
  width:10.0rem;
  margin:0 auto;
}
.has-before:before{
  border-top: 1px solid #98b3db!important;
}
.cell-border-top{
  border-top:1px solid #d3e1f5!important;
}
.cell-border-bottom{
  border-bottom:1px solid #d3e1f5!important;
}
.footer{
  text-align: center;
  width: 100%;
  color: #999999;
  font-size: 1rem;
  position: absolute;
  bottom: 2rem;
}
</style>

