<template>
  <view-box ref="viewBox" :class="$route.path === '/guidance' ? 'tab__panel_guidance' : ''" :body-padding-bottom="$route.path === '/guidance' || $route.path === '/agreement' || $route.path === '/user-agreement' || $route.path === '/wallet-manage' ? '0' : '50px'" style="height:100%;width:100%;overflow-y:auto;">
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
  </view-box>
  <!-- <div :class="$route.path === '/guidance' ? 'weui-tab__panel_guidance' : ''">

  </div> -->
</template>

<script>
import CryptoJS from 'crypto-js'
import AES from 'crypto-js/aes'
import ecc from 'eosjs-ecc'
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
  .vux-x-input .weui-cell__primary .weui-input::-webkit-input-placeholder {
    color: #cccccc;
    font-size: 0.928571rem;
  }
  .is-error-step .vux-step-item-head-finish .vux-step-item-head-inner{
    border: 1px solid #f59902!important;
    color: #f59902!important;
  }
  .is-error-step .vux-step-item-icon .weui-icon-success-no-circle{
    color: #f59902!important;
  }
  .is-error-step .weui-icon-success-no-circle:before {
    content: "\EA03";
  }
  .is-error-step .vux-step-item-main{
    color: #f59902!important;
  }
  .vux-header .vux-header-title{
    font-weight: 200!important;
  }
  .vux-fixed .vux-tab{
    height: 3.285714rem!important;
    background-color:#3287fd!important;
    .vux-tab-item.vux-tab-selected{
      color:#ffffff!important;
      font-weight: 200!important;
    }
  }
  // .vux-header {
  //   padding: 1.428571rem 0 3px 0!important;
  // }
  // .vux-header .vux-header-left .left-arrow{
  //   top:0.714286rem!important;
  // }
  body {
    background-color: #fbf9fe;
  }
  .weui-tab__panel_guidance{
    box-sizing: border-box;
    height: 100%;
    overflow: auto;
  }
  .weui-icon-success {
    font-size: 23px;
    color: #3287fd!important;
  }
  html, body {
    height: 100%;
    width: 100%;
    overflow-x: hidden;
  }
  .demo-icon-22 {
    font-family: 'vux-demo';
    font-size: 1.571429rem;
    color: #888;
  }
  #vux_view_box_body{
    background-color: #f5f5f5;
  }
  .weui-cells{
    margin-top: 0!important;
    background-color: #f5f5f5!important;
  }
  .weui-cell{
    background-color: #ffffff;
  }
  .weui-cell:before{
    border-top: none!important;
  }
  .weui-tabbar.vux-demo-tabbar {
    /** backdrop-filter: blur(10px);
    background-color: none;
    background: rgba(247, 247, 250, 0.5);**/
  }
  .vux-demo-tabbar .weui-bar__item_on .demo-icon-22 {
    color: #F70968;
  }
  .weui-cell_access .weui-cell__ft:after{
    border-color: #8a8a8c!important;
  }
  .vux-demo-tabbar .weui-tabbar_item.weui-bar__item_on .vux-demo-tabbar-icon-home {
    color: rgb(53, 73, 94);
  }
  .demo-icon-22:before {
    content: attr(icon);
  }
  .vux-demo-tabbar-component {
    background-color: #F70968;
    color: #fff;
    border-radius: 0.5rem;
    padding: 0 4px;
    line-height: 1.0rem;
  }
  .weui-tabbar__icon + .weui-tabbar__label {
    margin-top: 0!important;
  }
  .vux-demo-header-box {
    z-index: 100;
    position: absolute;
    width: 100%;
    left: 0;
    top: 0;
  }
  @font-face {
    font-family: 'vux-demo';  /* project id 70323 */
    src: url('https://at.alicdn.com/t/font_h1fz4ogaj5cm1jor.eot');
    src: url('https://at.alicdn.com/t/font_h1fz4ogaj5cm1jor.eot?#iefix') format('embedded-opentype'),
    url('https://at.alicdn.com/t/font_h1fz4ogaj5cm1jor.woff') format('woff'),
    url('https://at.alicdn.com/t/font_h1fz4ogaj5cm1jor.ttf') format('truetype'),
    url('https://at.alicdn.com/t/font_h1fz4ogaj5cm1jor.svg#iconfont') format('svg');
  }
  .demo-icon {
    font-family: 'vux-demo';
    font-size: 1.428571rem;
    color: #04BE02;
  }
  .demo-icon-big {
    font-size: 2.0rem;
  }
  .demo-icon:before {
    content: attr(icon);
  }
  .router-view {
    width: 100%;
    top: 3.285714rem;
  }
  .vux-pop-out-enter-active,
  .vux-pop-out-leave-active,
  .vux-pop-in-enter-active,
  .vux-pop-in-leave-active {
    will-change: transform;
    transition: all 500ms;
    height: 100%;
    top: 3.285714rem;
    position: absolute;
    backface-visibility: hidden;
    perspective: 1000;
  }
  .vux-pop-out-enter {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }
  .vux-pop-out-leave-active {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
  .vux-pop-in-enter {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
  .vux-pop-in-leave-active {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }
  .menu-title {
    color: #888;
  }
  .weui-tabbar__icon {
    height: 23px!important;
  }
</style>

