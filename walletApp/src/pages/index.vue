<template>
  <div style="height:100%;">
    <div v-transfer-dom>
      <loading v-model="isLoading"></loading>
    </div>
    <div v-transfer-dom>
      <actionsheet :menus="menus" v-model="showMenu" @on-click-menu="changeLocale"></actionsheet>
    </div>
    <x-header >
      <img @click="onClickMore" class="sys" slot="overwrite-left" src="../assets/language.png"/>
      <img @click="qrcode" class="sys" slot="right" src="../assets/sys.png"/>
    </x-header>
    <account-detail :wallet="wallets[0]"></account-detail>
  </div>
</template>

<script>
import { Radio, Group, Cell, Badge, Drawer, Actionsheet, ButtonTab, ButtonTabItem, ViewBox, XHeader, Tabbar, TabbarItem, Loading, TransferDom } from 'vux'
import util from '../libs/utils'
import accountDetail from '../components/accountDetail'
import AccountImage from '../components/AccountImage'
export default {
  name: 'index',
  directives: {
    TransferDom
  },
  components: {
    Radio,
    Group,
    Cell,
    Badge,
    Drawer,
    ButtonTab,
    ButtonTabItem,
    ViewBox,
    XHeader,
    Tabbar,
    TabbarItem,
    Loading,
    Actionsheet,
    AccountImage,
    accountDetail
  },
  methods: {
    onClickMore () {
      this.showMenu = true
    },
    changeLocale (locale) {
      util.setStore('_locale', locale)
      this.$i18n.locale = locale
    },
    qrcode () {
      // var permissions = cordova.plugins.permissions
      // permissions.hasPermission(permissions.CAMERA, checkPermissionCallback, null)
      // function checkPermissionCallback (status) {
      //   if (!status.hasPermission) {
      //     var errorCallback = function () {
      //       alert('请在系统设置中打开本应用的相机权限')
      //     }
      //     permissions.requestPermission(
      //       permissions.CAMERA,
      //       function (status) {
      //         if (!status.hasPermission) errorCallback()
      //         cordova.plugins.barcodeScanner.scan(
      //           function (result) {
      //             alert('We got a barcode\n' + 'Result: ' + result.text + '\n' + 'Format: ' + result.format + '\n' + 'Cancelled: ' + result.cancelled)
      //           }, null, 'QRCode', 'scan', []
      //         )
      //       },
      //       errorCallback)
      //   } else {
      //     cordova.plugins.barcodeScanner.scan(
      //       function (result) {
      //         alert('We got a barcode\n' + 'Result: ' + result.text + '\n' + 'Format: ' + result.format + '\n' + 'Cancelled: ' + result.cancelled)
      //       }, null, 'QRCode', 'scan', []
      //     )
      //   }
      // }
    }
  },
  mounted () {
    this.handler = () => {
      if (this.path === '/') {
        this.box = document.querySelector('#demo_list_box')
        this.updateDemoPosition(this.box.scrollTop)
      }
    }
  },
  beforeDestroy () {
    this.box && this.box.removeEventListener('scroll', this.handler, false)
  },
  created () {
    this.wallets = this.$common.get_wallets()
    console.log(this.$route.path)
  },
  data () {
    return {
      showMenu: false,
      menus: {
        'language.noop': '<span class="menu-title">Language</span>',
        'zh-CN': '中文',
        'en-US': 'English'
      },
      path: '/',
      isLoading: false,
      direction: 'forward',
      drawerVisibility: false,
      showMode: 'push',
      showModeValue: 'push',
      showPlacement: 'left',
      wallets: [],
      showPlacementValue: 'left'
    }
  }
}
</script>
<style lang="less" scoped>
.account-image-wrap{
  text-align: center;
  padding: 30px 0;
}
.sys{
  width: 25px;
  height: 25px;
}
// @header-background-color:#fff
</style>
