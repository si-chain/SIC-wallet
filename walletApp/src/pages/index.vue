<template>
  <div style="height:100%;overflow:hidden">
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
    <account-detail></account-detail>
    <!-- <flexbox class="balance">
      <cell title="SIC">
        <img slot="icon" class="backup-icon" src="../assets/icon_14.png" width="25" height="25" alt=""> -->
        <!-- <img class="eye" v-if="isShow" @click="showFlag" src="../assets/eyez.png"/>
        <img class="eye" v-else @click="showFlag" src="../assets/eyeb.png"/> -->
      <!-- </cell>
      <flexbox-item></flexbox-item>
      <flexbox-item>
        <span v-if="isShow" class="center">{{balance}}</span>
        <span v-else class="center">******</span>
      </flexbox-item>
    </flexbox> -->
    <div class="is-backup">
      <cell v-if="isTransfer" :title="$t('index.SIC')" :value="balance + '  SIC'" is-link :link="`/transfer?account=${this.$store.state.account}`">
        <img slot="icon" class="backup-icon" src="../assets/icon_14.png" width="25" height="25" alt="">
      </cell>
      <cell v-else :title="$t('index.SIC')" :value="balance + '  SIC'" >
        <img slot="icon" class="backup-icon" src="../assets/icon_14.png" width="25" height="25" alt="">
      </cell>
      <cell :title="$t('index.backup_wallet')" is-link :link="`/wallet-backup?account=${this.$store.state.account}`">
        <img slot="icon" class="backup-icon" src="../assets/icon_11.png" width="25" height="25" alt="">
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
import { Radio, Group, Cell, Flexbox, FlexboxItem, Badge, Drawer, Confirm, Alert, Msg, Actionsheet, ButtonTab, ButtonTabItem, ViewBox, XHeader, Tabbar, TabbarItem, Loading, TransferDom } from 'vux'
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
                }, null, 'QRCode', 'scan', []
              )
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
            }, null, 'QRCode', 'scan', []
          )
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
      let account = this.$store.state.account
      this.$http.get(`${this.basePath}/v1/chain/accounts/eos/${account}`).then(res => {
        let data = res.data
        if (data.data.mobile) {
          this.$store.commit('upDataIdentityAccount', account)
        }
        if (data.code === 200) {
          this.balance = data.data.eos_balance.split(' ')[0]
        } else {
          this.balance = '0'
        }
      }).catch(() => {
        this.$router.push('/create-account')
      })
    },
    showFlag () {
      this.isShow = !this.isShow
    },
    onConfirm () {
      let accountArr = this.$common.get_wallets()
      let data = ''
      let _this = this
      accountArr.map(item => {
        if (item.account === this.$store.state.account) {
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
      // let nums =
      this.$http.get(`http://sic-client.oss-cn-beijing.aliyuncs.com/version.json?num=${Math.random() * 1000}`).then(data => {
        data = data.data
        this.serverAppVersion = data.version[data.version.length - 1].ver
        // let serverAppContent = data.version[data.version.length - 1].msg
        this.AppUpDataUrl = data.version[data.version.length - 1].url
        // var permissions = cordova.plugins.permissions
        // permissions.hasPermission(permissions.READ_EXTERNAL_STORAGE, checkPermissionCallback, null)
        // function checkPermissionCallback (status) {
        //   if (!status.hasPermission) {
        //     var errorCallback = function () {
        //       console.warn('Storage permission is not turned on')
        //     }
        //     permissions.requestPermission(permissions.READ_EXTERNAL_STORAGE, function (status) {
        //       if (!status.hasPermission) {
        //         errorCallback()
        //       } else {
        //         // continue with downloading/ Accessing operation
        //         console.log('权限已开')
        //       }
        //     }, errorCallback)
        //   }
        // }
        console.log(this.isVersions, this.serverAppVersion)
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
      // this.showUpdateShow = false
      // this.onLoadingShow = true
      // this.onLoadingText = '正在下载'
      // let _this = this
      // let url = this.AppUpDataUrl
      // let filename = url.split('/').pop()
      // let trustHosts = true
      // let targetPath = cordova.file.externalRootDirectory + filename
      // let options = {}
      // cordova.FileTransfer.download(url, targetPath, options, trustHosts).then(function(result) {
      //     // 打开下载下来的APP
      //     cordova.FileOpener2.open(targetPath, 'application/vnd.android.package-archive').then(function() {
      //       // 成功
      //       console.log('success')
      //     }, function(err) {
      //       // 错误
      //       console.log('error')
      //     })
      //     _this.onLoadingShow = false
      // }, function(err) {
      //     console.log(err)
      //     _this.onLoadingShow = false
      // }, function(progress) {
      //     //进度，这里使用文字显示下载百分比
      //     var downloadProgress = (progress.loaded / progress.total) * 100
      //     _this.onLoadingText = '已经下载：' + Math.floor(downloadProgress) + '%'
      //     if (downloadProgress > 99) {
      //       _this.onLoadingShow = false
      //     }
      // })
      // let FileTransfer = cordova.plugins.FileTransfer
      // var fileTransfer = new FileTransfer()
      // fileTransfer.download(url, targetPath, () => {
      //   alert('下载成功')
      //   cordova.plugins.fileOpener2.open(targetPath, 'application/vnd.android.package-archive')
      // }, err => {
      //   alert(JSON.stringify(err))
      //   _this.onLoadingShow = false
      //   alert('下载失败')
      // }, trustHosts)
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
    this.checkUpdate()
    this.wallets = this.$common.get_wallets()
    if (this.$route.query.account) {
      this.$store.state.account = this.$route.query.account
    }
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
  padding: 30px 0;
}
.sys{
  width: 25px;
  height: 25px;
}
.backup-icon{
  vertical-align: middle;
  margin-right: 10px;
}
.name{
  line-height: 30px;
  img{
    height: 17px;
    width: 17px;
    margin-left: 20px;
  }
}
.is-backup{
  font-size: 18px;
  color: #333333;
  background-color:#fff;
  .weui-cell{
    border-bottom: 1px solid #D9D9D9;
  }
}
.eye{
  width: 17px;
  height: 15px;
  margin-left: 10px;
}
.balance{
  line-height: 21px;
  border-bottom: 1px solid #D9D9D9;
  background-color:#fff;
  padding: 2px 0;
}
// @header-background-color:#fff
</style>
