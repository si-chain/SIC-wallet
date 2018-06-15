<template>
  <div style="height:100%;overflow:hidden">
    <div v-transfer-dom>
      <loading v-model="isLoading"></loading>
    </div>
    <div v-transfer-dom>
      <actionsheet :menus="menus" v-model="showMenu" @on-click-menu="changeLocale"></actionsheet>
    </div>
    <!-- <x-header >
      <img @click="onClickMore" class="sys" slot="overwrite-left" src="../assets/language.png"/>
      <img @click="qrcode" class="sys" slot="right" src="../assets/sys.png"/>
    </x-header> -->
    <div class="index-header">
      <img @click="onClickMore" class="sys" src="../assets/language.png"/>
      <img v-if="isNative" @click="qrcode" class="sys" style="float:right;margin-right:1.142857rem" src="../assets/sys.png"/>
    </div>
    <account-detail></account-detail>
    <div class="is-backup">
      <cell v-if="isTransfer" class="none-bottom" :title="$t('index.SIC')" :value="balance + '  SIC'" is-link :link="`/transfer?account=${this.$store.state.account}`">
        <img slot="icon" class="backup-icon" src="../assets/icon_14.png" width="20" height="22" alt="">
      </cell>
      <cell v-else :title="$t('index.SIC')" :value="balance + '  SIC'" >
        <img slot="icon" class="backup-icon" src="../assets/icon_14.png" width="20" height="22" alt="">
      </cell>
      <cell :title="$t('index.backup_wallet')" is-link :link="`/wallet-backup?account=${this.$store.state.account}`">
        <img slot="icon" style="margin-left:-2px" class="backup-icon" src="../assets/icon_11.png" width="24" height="22" alt="">
      </cell>
    </div>
    <div v-transfer-dom>
      <confirm v-model="showConfirm"
      :title="$t('index.authorization')"
      @on-cancel="onCancel"
      @on-confirm="onConfirm">
        <p style="text-align:center;">{{ $t('index.confirm_authorization') }}</p>
      </confirm>
    </div>
     <div v-transfer-dom>
       <toast v-model="httpError" width="60%" type="text" :time="1000" is-show-mask :text="$t('index.http_error')" position="middle">
         <!-- {{ $t('index.http_error')}} -->
       </toast>
    </div>
    <div v-transfer-dom>
      <alert v-model="show" button-text=" ">
        <msg slot="default" :title="title" :buttons="buttons" :icon="icon"></msg>
      </alert>
    </div>
    <div v-transfer-dom>
      <confirm
      v-model="showUpdateShow"
      :close-on-confirm="false"
      title="版本更新"
      @on-confirm="showUpdateConfirm">
        <p style="text-align:center;">有新版本发布，请及时更新！</p>
      </confirm>
    </div>
    <div v-transfer-dom>
      <loading :show="onLoadingShow" :text="onLoadingText"></loading>
    </div>
  </div>
</template>

<script>
import { Radio, Group, Toast, Cell, Flexbox, FlexboxItem, Badge, Drawer, Confirm, Alert, Msg, Actionsheet, ButtonTab, ButtonTabItem, ViewBox, XHeader, Tabbar, TabbarItem, Loading, TransferDom } from 'vux'
import util from '../libs/utils'
import AppConfig from '../libs/config'
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
    Confirm,
    Toast,
    Cell,
    Alert,
    Msg,
    Badge,
    Flexbox,
    FlexboxItem,
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
      let _this = this
      let options = {
        preferFrontCamera: true, // iOS and Android
        showFlipCameraButton: true, // iOS and Android
        showTorchButton: true, // iOS and Android
        torchOn: true, // Android, launch with the torch switched on (if available)
        saveHistory: true, // Android, save scan history (default false)
        prompt: 'Place a barcode inside the scan area', // Android
        resultDisplayDuration: 1500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
        formats: 'QR_CODE,PDF_417', // default: all but PDF_417 and RSS_EXPANDED
        orientation: 'landscape', // Android only (portrait|landscape), default unset so it rotates with the device
        disableAnimations: true, // iOS
        disableSuccessBeep: false // iOS and Android
      }
      let permissions = cordova.plugins.permissions
      permissions.hasPermission(permissions.CAMERA, checkPermissionCallback, null)
      function checkPermissionCallback (status) {
        if (!status.hasPermission) {
          let errorCallback = function () {
            alert('请在系统设置中打开本应用的相机权限')
          }
          permissions.requestPermission(
            permissions.CAMERA,
            function (status) {
              if (!status.hasPermission) errorCallback()
              cordova.plugins.barcodeScanner.scan(
                function (result) {
                  let resultStr = result.text
                  if (result.includes('qr://sic/login/')) {
                    _this.showConfirm = true
                    _this.code = resultStr.replace('qr://sic/login/', '')
                  }
                }, function (error) {
                  console.log(error)
                  alert('二维码不正确')
                }, options)
            },
            errorCallback)
        } else {
          cordova.plugins.barcodeScanner.scan(
            function (result) {
              let resultStr = result.text
              if (resultStr.includes('qr://sic/login/')) {
                _this.showConfirm = true
                _this.code = resultStr.replace('qr://sic/login/', '')
              }
            }, function (error) {
              console.log(error)
              alert('二维码不正确')
            }, options)
        }
      }
    },
    onCancel () {
      this.showConfirm = false
    },
    linkBackup (account) {
      let query = {
        account: this.$store.state.account
      }
      this.$router.push({path: '/wallet-backup', query})
    },
    loadBalance () {
      let account = this.$route.query.account || this.$store.state.account
      if (account) {
        this.$http.get(`${this.basePath}/v1/chain/accounts/eos/${account}`).then(res => {
          let data = res.data
          if (data.code === 200) {
            this.balance = data.data.balance.split(' ')[0]
            this.$common.setStore('accountInfo', data.data)
          } else {
            this.balance = '0'
          }
          if (data.data.mobile) {
            this.$store.commit('upDataIdentityAccount', account)
          }
        }).catch((err) => {
          console.log(err)
          this.httpError = true
          if (!this.$common.getStore('accountInfo')) {
            this.$router.push('/create-account')
          } else {
            this.balance = JSON.parse(this.$common.getStore('accountInfo')).balance.split(' ')[0]
          }
        })
      } else {
        this.$router.push('/create-account')
      }
    },
    showFlag () {
      this.isShow = !this.isShow
    },
    onConfirm () {
      let accountArr = this.$common.get_wallets()
      let data = ''
      let _this = this
      accountArr.map(item => {
        if (item.account === this.$route.query.account || item.account === this.$store.state.account) {
          data = { 'data': item }
          this.$http.post(`${this.basePath}/v1/login/qrCode/${this.code}`, data).then(res => {
            let responese = res.data
            if (responese.code === 200) {
              _this.show = true
              _this.icon = 'success'
              _this.title = _this.$t('index.success')
              _this.buttons[0].type = 'primary'
              _this.buttons[0].text = _this.$t('index.success')
            } else {
              _this.show = true
              _this.icon = 'warn'
              _this.title = _this.$t('index.error')
              _this.buttons[0].type = 'warn'
              _this.buttons[0].text = _this.$t('index.error')
            }
          }).catch(er => {
            _this.show = true
            _this.icon = 'warn'
            _this.title = _this.$t('index.error')
            _this.buttons[0].type = 'warn'
            _this.buttons[0].text = _this.$t('index.error')
          })
        }
      })
    },
    checkUpdate () {
      // 从服务端获取最新版本
      this.$http.get(`http://sic-client.oss-cn-beijing.aliyuncs.com/version.json?num=${Math.random() * 1000}`).then(data => {
        data = data.data
        this.serverAppVersion = data.version[data.version.length - 1].ver
        this.AppUpDataUrl = data.version[data.version.length - 1].url
        if (this.isVersions !== this.serverAppVersion) {
          this.showUpdateShow = true
        }
      })
    },
    /***
     *
     */
    showUpdateConfirm () {
      window.location.href = this.AppUpDataUrl
    },
    keepOn () {
      this.show = false
    }
  },
  mounted () {
    this.handler = () => {
      if (this.path === '/') {
        this.box = document.querySelector('#demo_list_box')
        this.updateDemoPosition(this.box.scrollTop)
      }
    }
    if (!this.$route.params.account) {
      this.$router.push(`/?account=${this.$store.state.account}`)
    }
    this.loadBalance()
  },
  beforeDestroy () {
    this.box && this.box.removeEventListener('scroll', this.handler, false)
  },
  created () {
    if (AppConfig.isNative) {
      this.checkUpdate()
    }
    this.wallets = this.$common.get_wallets()
    if (this.$route.query.account) {
      this.$store.state.account = this.$route.query.account
    }
    this.$store.state.msgList = []
    this.$http.get(`${this.basePath}/v1/msg/user/${this.$store.state.account}?limit=100`, { lowerBound: 0 }).then(res => {
      let data = res.data.data.rows
      this.$store.commit('upDataMsg', data.some((item) => {
        return item.status === 0
      }))
      data.map(item => {
        if (item.status === 0) {
          this.$store.commit('upDataMsgList', item)
        }
      })
    })
  },
  data () {
    return {
      showMenu: false,
      showConfirm: false,
      show: false,
      menus: {
        'language.noop': '<span class="menu-title">Language</span>',
        'zh-CN': '中文',
        'en-US': 'English'
      },
      code: '',
      path: '/',
      isLoading: false,
      httpError: false,
      direction: 'forward',
      drawerVisibility: false,
      showMode: 'push',
      showModeValue: 'push',
      showPlacement: 'left',
      wallets: [],
      showPlacementValue: 'left',
      icon: 'success',
      title: this.$t('index.success'),
      buttons: [{
        type: 'primary',
        text: this.$t('index.success'),
        onClick: this.keepOn.bind(this)
      }],
      balance: '0',
      isBackup: true,
      isShow: true,
      onLoadingShow: false,
      onLoadingText: '',
      showUpdateShow: false,
      isVersions: AppConfig.versions,
      serverAppVersion: '',
      AppUpDataUrl: '',
      isNative: AppConfig.isNative,
      isTransfer: AppConfig.isTransfer
    }
  }
}
</script>
<style lang="less" scoped>
.vux-header{
  background-color: #06319a!important;
}
.account-image-wrap{
  text-align: center;
  padding: 2.142857rem 0;
}
.index-header{
  position: absolute;
  z-index: 9999;
  width: 100%;
}
.sys{
  width: 1.785714rem;
  height: 1.785714rem;
  margin-top: 1.0rem;
  margin-left: 1.142857rem;
}
.backup-icon{
  vertical-align: middle;
  margin-right: 0.714286rem;
}
.name{
  line-height: 2.142857rem;
  img{
    height: 1.214286rem;
    width: 1.214286rem;
    margin-left: 1.428571rem;
  }
}
.is-backup{
  font-size: 1.142857rem;
  color: #333333;
  background-color:#fff;
  .weui-cell{
    border-bottom: 1px solid #e5e5e5;
  }
  // .none-bottom{
  //   border-bottom:none;
  // }
  // .weui-cell:before{
  //   border-top: 1px solid #e5e5e5;
  // }
}
.eye{
  width: 1.214286rem;
  height: 1.071429rem;
  margin-left: 0.714286rem;
}
.balance{
  line-height: 1.5rem;
  border-bottom: 1px solid #e5e5e5;
  background-color:#fff;
  padding: 2px 0;
}
// @header-background-color:#fff
</style>
