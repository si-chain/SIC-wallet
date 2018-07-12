<template>
    <div>
      <sic-header :left-options="option">{{$t('left_panel.about')}}</sic-header>
      <div class="logo-wrap">
        <img class="logo" src="../assets/images/logo_about.png" alt="">
      </div>
      <sic-cell class="align-center" :title="$t('index.version_log')" :link="`/version-log?account=${this.$store.state.account}`">
        <img slot="icon" class="icon" src="../assets/images/ico_log_about.png" alt="">
      </sic-cell>
      <sic-cell class="align-center" :title="$t('index.version_update')" @click.native="checkUpdata" :isLink="false">
        <img slot="icon" class="icon" src="../assets/images/ico_monitoring_about.png" alt="">
      </sic-cell>
      <div class="footer">
        <p class="footer-tip">SIC Foundation</p>
      </div>
      <!-- <div v-transfer-dom>
        <confirm
        v-model="showUpdateShow"
        :close-on-confirm="true"
        title="版本更新">
          <p style="text-align:center;">已经是最新版</p>
        </confirm>
      </div> -->
    </div>
</template>
<script>
import sicHeader from '../components/sicHeader'
import sicCell from '../components/sicCell'
import AppConfig from '../libs/config'
export default {
  components: {
    sicHeader,
    sicCell
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
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.logo-wrap{
  width: 100%;
  height: 16.428571rem;
  background-image: url(../assets/images/bg_wallet.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  .logo{
    width: 6.428571rem;
    height: 10rem;
    margin: 2.857143rem;
  }
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

