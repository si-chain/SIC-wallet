<template>
    <div>
      <div class="clearfix menu-box">
        <div class="menu-header menu-nav">
          <div class="header-left-logo header-item">
            <img class="middle" src="../assets/images/img_logo.png" width="95px" alt="">
          </div>
          <div class="header-right-btn header-item">
            <span class="inline-block language" @click="language">
              <img class="middle" width="24" src="../assets/images/ico_font.png" alt="">
            </span>
            <span class="inline-block scan" @click="qrcode">
              <img class="middle" width="24" src="../assets/images/ico_scan.png" alt="">
            </span>
          </div>
        </div>
        <ul class="menu-nav">
          <li class="menu-item" :class="$route.path === '/' ? 'menu-active' : ''"><router-link to="/">{{$t('index.wallet')}}</router-link></li>
          <li class="menu-item" :class="$route.path === '/policy' ? 'menu-active' : ''"><router-link to="/policy">{{$t('policy.tip_insurance')}}</router-link></li>
          <li class="menu-item" :class="$route.path === '/home' ? 'menu-active' : ''"><router-link to="/home">{{$t('index.home')}}</router-link></li>
        </ul>
        <div v-transfer-dom>
          <actionsheet :menus="menus" v-model="showMenu" @on-click-menu="changeLocale"></actionsheet>
        </div>
        <div v-transfer-dom>
          <confirm v-model="showConfirm"
          :title="$t('index.authorization')"
          @on-cancel="onScanCancel"
          @on-confirm="onScanConfirm">
            <p style="text-align:center;">{{ $t('index.confirm_authorization') }}</p>
          </confirm>
        </div>
        <div v-transfer-dom>
          <alert v-model="qrcodeShow" button-text=" ">
            <msg slot="default" :title="title" :buttons="buttons" :icon="icon"></msg>
          </alert>
        </div>
        <!-- <tabbar class="clearfix" style="width:100%;position:absolute;left:0;top:0;z-index:100;height:2.875rem">
            <tabbar-item :selected="$route.path === '/'" link="/">
                <img style="margin-top:2px;height: 17px!important;width: 22px!important;" slot="icon" src="../assets/icon_01-03.png">
                <img style="margin-top:2px;height: 17px!important;width: 22px!important;" slot="icon-active" src="../assets/icon_01-01.png">
                <span slot="label">{{$t('index.wallet')}}</span>
            </tabbar-item>
            <tabbar-item :selected="$route.path === '/policy'" link="/policy">
                <img style="width: 26px!important;height: 23px!important;" slot="icon" src="../assets/icon_01-06.png">
                <img style="width: 26px!important;height: 23px!important;" slot="icon-active" src="../assets/icon_01-04.png">
                <span slot="label">{{$t('policy.tip_insurance')}}</span>
            </tabbar-item>
            <tabbar-item :selected="$route.path === '/home'" :show-dot="$store.state.hasMsg" link="/home">
                <img style="width: 22px!important;height: 22px!important;" slot="icon" src="../assets/icon_01-05.png">
                <img style="width: 22px!important;height: 22px!important;" slot="icon-active" src="../assets/icon_01-02.png">
                <span slot="label">{{$t('index.home')}}</span>
            </tabbar-item>
        </tabbar> -->
      </div>
      <router-view></router-view>
    </div>
    
</template>

<script>
import {Tabbar, TabbarItem, Loading, Actionsheet, Alert, Msg, Confirm, TransferDom} from 'vux'
export default {
  name: 'indexMenu',
  directives: {
    TransferDom
  },
  components: {
    Tabbar,
    TabbarItem,
    Loading,
    Actionsheet,
    Alert,
    Msg,
    Confirm
  },
  data () {
    return {
      code: '',
      showMenu: false,
      showConfirm: false,
      qrcodeShow: false,
      icon: 'success',
      title: this.$t('index.success'),
      buttons: [{
        type: 'primary',
        text: this.$t('index.success'),
        onClick: this.keepOn.bind(this)
      }],
      menus: {
        'language.noop': '<span class="menu-title">Language</span>',
        'zh-CN': '中文',
        'en-US': 'English'
      }
    }
  },
  methods: {
    language () {
      this.showMenu = true
    },
    changeLocale (locale) {
      this.$common.setStore('_locale', locale)
      this.$i18n.locale = locale
    },
    onScanCancel () {
      this.showConfirm = false
    },
    onScanConfirm () {
      let accountArr = this.$common.get_wallets()
      let data = ''
      let _this = this
      accountArr.map(item => {
        if (item.account === this.$route.query.account || item.account === this.$store.state.account) {
          data = { 'data': item }
          this.$http.post(`${this.basePath}/v1/login/qrCode/${this.code}`, data).then(res => {
            let responese = res.data
            if (responese.code === 200) {
              _this.qrcodeShow = true
              _this.icon = 'success'
              _this.title = _this.$t('index.success')
              _this.buttons[0].type = 'primary'
              _this.buttons[0].text = _this.$t('index.success')
            } else {
              _this.qrcodeShow = true
              _this.icon = 'warn'
              _this.title = _this.$t('index.error')
              _this.buttons[0].type = 'warn'
              _this.buttons[0].text = _this.$t('index.error')
            }
          }).catch(er => {
            _this.qrcodeShow = true
            _this.icon = 'warn'
            _this.title = _this.$t('index.error')
            _this.buttons[0].type = 'warn'
            _this.buttons[0].text = _this.$t('index.error')
          })
        }
      })
    },
    keepOn () {
      this.qrcodeShow = false
    },
    qrcode () {
      console.log(111)
      // let _this = this
      // let options = {
      //   preferFrontCamera: true, // iOS and Android
      //   showFlipCameraButton: true, // iOS and Android
      //   showTorchButton: true, // iOS and Android
      //   torchOn: true, // Android, launch with the torch switched on (if available)
      //   saveHistory: false, // Android, save scan history (default false)
      //   prompt: 'Place a barcode inside the scan area', // Android
      //   resultDisplayDuration: 1500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
      //   formats: 'QR_CODE,PDF_417', // default: all but PDF_417 and RSS_EXPANDED
      //   orientation: 'portrait', // Android only (portrait|landscape), default unset so it rotates with the device
      //   disableAnimations: true, // iOS
      //   disableSuccessBeep: false // iOS and Android
      // }
      // try {
      //   let permissions = cordova.plugins.permissions
      //   permissions.hasPermission(permissions.CAMERA, checkPermissionCallback, null)
      //   function checkPermissionCallback (status) {
      //     if (!status.hasPermission) {
      //       let errorCallback = function () {
      //         alert('请在系统设置中打开本应用的相机权限')
      //       }
      //       permissions.requestPermission(
      //         permissions.CAMERA,
      //         function (status) {
      //           if (!status.hasPermission) errorCallback()
      //           cordova.plugins.barcodeScanner.scan(
      //             function (result) {
      //               let resultStr = result.text
      //               if (result.includes('qr://sic/login/')) {
      //                 _this.showConfirm = true
      //                 _this.code = resultStr.replace('qr://sic/login/', '')
      //               }
      //             }, function (error) {
      //               console.log(error)
      //               alert('二维码不正确')
      //             }, options)
      //         },
      //         errorCallback)
      //     } else {
      //       cordova.plugins.barcodeScanner.scan(
      //         function (result) {
      //           let resultStr = result.text
      //           if (resultStr.includes('qr://sic/login/')) {
      //             _this.showConfirm = true
      //             _this.code = resultStr.replace('qr://sic/login/', '')
      //           }
      //         }, function (error) {
      //           console.log(error)
      //           alert('二维码不正确')
      //         }, options)
      //     }
      //   }
      // } catch (err) {
      //   cordova.plugins.barcodeScanner.scan(
      //     function (result) {
      //       let resultStr = result.text
      //       if (result.includes('qr://sic/login/')) {
      //         _this.showConfirm = true
      //         _this.code = resultStr.replace('qr://sic/login/', '')
      //       }
      //     }, function (error) {
      //       console.log(error)
      //       alert('二维码不正确')
      //     }, options)
      // }
    }
  },
  created () {
  }
}
</script>
<style lang="less" scoped>
  .menu-box{
    // position: fixed;
    padding-top: 1.428571rem;
    position: absolute;
    top:0;
    width: 100%;
    z-index: 9999;
    background: @header-background-color;
  }
  .menu-nav{
    display: flex;
    flex-direction: row; 
  }
  .menu-item{
    flex: 1;
    height: 3.214286rem;
    text-align: center;
    line-height: 3.3rem;
    font-size: 1.2rem;
    background: @header-background-color;
    a{
      color:#8899ac;
    }
    font-weight: 900;
  }
  .menu-active {
    border-bottom: 2px solid #377FB9;
    a{
      color: #377FB9;
    }
  }
  .header-item{
    flex: 1;
    height: 3.571429rem;
    display: flex;
    align-items:center;
  }
  .header-left-logo{
    .middle{
      margin-left: 1.785714rem;
    }
  }
  .header-right-btn{
    display: flex;
    justify-content: flex-end;
    .language{
      margin-right: 2.142857rem;
    }
    .scan{
      margin-right: 1.142857rem;
    }
  }
</style>
