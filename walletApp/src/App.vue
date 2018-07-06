<template>
  <!-- <view-box ref="viewBox" :class="$route.path === '/guidance' ? 'tab__panel_guidance' : ''" :body-padding-bottom="$route.path === '/guidance' || $route.path === '/agreement' || $route.path === '/user-agreement' || $route.path === '/wallet-manage' ? '0' : '50px'" style="height:100%;width:100%;overflow-y:auto;">
    <router-view class="router-view"></router-view>
    <tabbar v-if="($route.path === '/' || $route.path === '/home' || $route.path === '/policy' || $route.path === '*')&& $route.path !== '/guidance'" slot="bottom" style="width:100%;position:absolute;left:0;bottom:0;z-index:100;">
      <tabbar-item :selected="$route.path === '/'" link="/" @on-index-change="onIndexChange">
        <img style="margin-top:2px;height: 17px!important;width: 22px!important;" slot="icon" src="./assets/icon_01-03.png">
        <img style="margin-top:2px;height: 17px!important;width: 22px!important;" slot="icon-active" src="./assets/icon_01-01.png">
        <span slot="label">{{$t('index.wallet')}}</span>
      </tabbar-item>
      <tabbar-item :selected="$route.path === '/policy'" link="/policy">
        <img style="width: 26px!important;height: 23px!important;" slot="icon" src="./assets/icon_01-06.png">
        <img style="width: 26px!important;height: 23px!important;" slot="icon-active" src="./assets/icon_01-04.png">
        <span slot="label">{{$t('policy.tip_insurance')}}</span>
      </tabbar-item>
      <tabbar-item :selected="$route.path === '/home'" :show-dot="$store.state.hasMsg" link="/home">
        <img style="width: 22px!important;height: 22px!important;" slot="icon" src="./assets/icon_01-05.png">
        <img style="width: 22px!important;height: 22px!important;" slot="icon-active" src="./assets/icon_01-02.png">
        <span slot="label">{{$t('index.home')}}</span>
      </tabbar-item>
    </tabbar>
  </view-box> -->
    <router-view class="router-view"></router-view>
</template>

<script>
import CryptoJS from 'crypto-js'
import AES from 'crypto-js/aes'
import ecc from 'eosjs-ecc'
import util from './libs/utils'
import AppConfig from './libs/config'
import { Tabbar, TabbarItem, Loading, Confirm, TransferDomDirective as TransferDom } from 'vux'
export default {
  name: 'app',
  directives: {
    TransferDom
  },
  components: {
    Tabbar,
    TabbarItem,
    Confirm,
    Loading
  },
  data () {
    return {
      isMsg: false,
      util: util,
      onLoadingShow: false,
      onLoadingText: '',
      showUpdateShow: false,
      isVersions: AppConfig.versions,
      serverAppVersion: '',
      AppUpDataUrl: ''
    }
  },
  methods: {
    /***
     * 加密
     * @param
     * data（String） => 需要加密的字符串
     * password (String) => 加密的依据
     */
    encryption (data, password) {
      try {
        return AES.encrypt(data, password).toString()
      } catch (exception) {
        if (this.i18n._vm.locale.indexOf('CN') > -1) {
          this.errorMess('密码错误')
        } else {
          this.errorMess('Invalid password')
        }
      }
    },
    /**
     * 解密
     * @param
     * data（String） => 需要解密的字符串
     * password (String) => 解密的依据
     */
    decrypt (data, password) {
      try {
        return CryptoJS.enc.Utf8.stringify(AES.decrypt(data, password))
      } catch (exception) {
        if (this.i18n._vm.locale.indexOf('CN') > -1) {
          this.errorMess('密码错误')
        } else {
          this.errorMess('Invalid password')
        }
      }
      // return CryptoJS.enc.Utf8.stringify(AES.decrypt(data, password))
    },
    /**
     * 导出公钥
     * @param
     * data（String） => 需要解密的字符串
     * password (String) => 解密的依据
     */
    backupPublicKey (data, password) {
      let str = this.decrypt(data, password)
      if (str !== '') {
        let publicKey = ecc.privateToPublic(str)
        return publicKey
      }
    },
    /**
     * 备份导出
     * @param
     * data（Object） => 具有加密的对象
     * password (String) => 解密 加密的依据
     */
    backupExport (data, password) {
      let backupData = {
        'account': data.account
      }
      backupData.active = this.decrypt(data.active, password)
      backupData.owner = this.decrypt(data.owner, password)
      let exportStr = JSON.stringify(backupData)
      exportStr = this.encryption(exportStr, password)
      return exportStr
    },
    /**
     * 备份导入
     * @param
     * data（String） => 密文
     * password (String) => 解密 加密的依据
     */
    backupImport (data, password) {
      let backupData = null
      if (this.decrypt(data, password)) {
        backupData = JSON.parse(this.decrypt(data, password))
        return backupData
      } else {
        return false
      }
    },
    onIndexChange (newIndex, oldIndex) {
      console.log(newIndex, oldIndex)
    }
  },
  created () {
    if (this.$common.get_wallets()) {
      this.$store.commit('UPDATE_WALLETS', this.$common.get_wallets())
    }
    if (this.$common.get_wallets().length === 0) {
      this.$router.push('/create-account')
    } else {
      if (this.$store.state.account === '') {
        if (this.$route.params.account) {
          this.$store.state.account = this.$route.params.account
        } else {
          this.$store.state.account = this.$common.get_wallets()[0].account
        }
      }
    }
    if (AppConfig.isNative && !this.$common.getStore(AppConfig.versions)) {
      this.$common.setStore(AppConfig.versions, AppConfig.versions)
      this.$router.push('/guidance')
    }
  }
}
</script>
<style lang="less">
  @import '~vux/src/styles/reset.less';
  @import '~vux/src/styles/1px.less';
  @import '~vux/src/styles/tap.less';
  @import url('./style/common.less');
</style>

