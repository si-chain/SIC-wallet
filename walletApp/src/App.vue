<template>
  <div style="height:100%">
    <router-view class="router-view"></router-view>
    <tabbar>
      <tabbar-item selected link="/">
        <!-- <img slot="icon" src="../assets/demo/icon_nav_button.png"> -->
        <span slot="label">钱包</span>
      </tabbar-item>
      <tabbar-item show-dot>
        <!-- <img slot="icon" src="../assets/demo/icon_nav_msg.png"> -->
        <span slot="label">保单上传</span>
      </tabbar-item>
      <tabbar-item link="/home">
        <!-- <img slot="icon" src="../assets/demo/icon_nav_cell.png"> -->
        <span slot="label">我</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>

<script>
import CryptoJS from 'crypto-js'
import AES from 'crypto-js/aes'
import ecc from 'eosjs-ecc'
import { Tabbar, TabbarItem } from 'vux'
export default {
  name: 'app',
  components: {
    Tabbar,
    TabbarItem
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
    }
  }
}
</script>
<style lang="less">
  @import '~vux/src/styles/reset.less';
  @import '~vux/src/styles/1px.less';
  @import '~vux/src/styles/tap.less';
  body {
    background-color: #fbf9fe;
  }
  html, body {
    height: 100%;
    width: 100%;
    overflow-x: hidden;
  }
  .demo-icon-22 {
    font-family: 'vux-demo';
    font-size: 22px;
    color: #888;
  }
  .weui-tabbar.vux-demo-tabbar {
    /** backdrop-filter: blur(10px);
    background-color: none;
    background: rgba(247, 247, 250, 0.5);**/
  }
  .vux-demo-tabbar .weui-bar__item_on .demo-icon-22 {
    color: #F70968;
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
    border-radius: 7px;
    padding: 0 4px;
    line-height: 14px;
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
    font-size: 20px;
    color: #04BE02;
  }
  .demo-icon-big {
    font-size: 28px;
  }
  .demo-icon:before {
    content: attr(icon);
  }
  .router-view {
    width: 100%;
    top: 46px;
  }
  .vux-pop-out-enter-active,
  .vux-pop-out-leave-active,
  .vux-pop-in-enter-active,
  .vux-pop-in-leave-active {
    will-change: transform;
    transition: all 500ms;
    height: 100%;
    top: 46px;
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
</style>

