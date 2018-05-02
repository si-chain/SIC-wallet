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
    <account-detail></account-detail>
    <div class="is-backup">
      <cell :title="$t('index.backup_wallet')" is-link :link="`/wallet-backup?account=${this.$store.state.account}`">
        <img slot="icon" class="backup-icon" src="../assets/icon_11.png" width="25" height="25" alt="">
      </cell>
    </div>
    <flexbox class="balance">
      <cell title="SIC">
        <img slot="icon" class="backup-icon" src="../assets/icon_14.png" width="25" height="25" alt="">
        <img class="eye" v-if="isShow" @click="showFlag" src="../assets/eyez.png"/>
        <img class="eye" v-else @click="showFlag" src="../assets/eyeb.png"/>
      </cell>
      <flexbox-item></flexbox-item>
      <flexbox-item>
        <p v-if="isShow" class="center">{{balance}}</p>
        <p v-else class="center">******</p>
        </flexbox-item>
    </flexbox>
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
  </div>
</template>

<script>
import { Radio, Group, Cell, Flexbox, FlexboxItem, Badge, Drawer, Confirm, Alert, Msg, Actionsheet, ButtonTab, ButtonTabItem, ViewBox, XHeader, Tabbar, TabbarItem, Loading, TransferDom } from 'vux'
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
      // let _this = this
      // let permissions = cordova.plugins.permissions
      // permissions.hasPermission(permissions.CAMERA, checkPermissionCallback, null)
      // function checkPermissionCallback (status) {
      //   if (!status.hasPermission) {
      //     let errorCallback = function () {
      //       alert('请在系统设置中打开本应用的相机权限')
      //     }
      //     permissions.requestPermission(
      //       permissions.CAMERA,
      //       function (status) {
      //         if (!status.hasPermission) errorCallback()
      //         cordova.plugins.barcodeScanner.scan(
      //           function (result) {
      //             // alert('result.text:' + result.text, result.text.indexOf('webpolicy') === 0)
      //             // if (result.text.indexOf('webpolicy') === 0) {
      //             _this.showConfirm = true
      //             _this.code = result
      //             // }
      //           }, null, 'QRCode', 'scan', []
      //         )
      //       },
      //       errorCallback)
      //   } else {
      //     cordova.plugins.barcodeScanner.scan(
      //       function (result) {
      //         // alert('result.text:' + result.text, result.text.indexOf('webpolicy') === 0)
      //         // if (result.text.indexOf('webpolicy') === 0) {
      //         _this.showConfirm = true
      //         _this.code = result.text
      //         // }
      //       }, null, 'QRCode', 'scan', []
      //     )
      //   }
      // }
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
        if (data.code === 200) {
          this.balance = data.data.eos_balance.split(' ')[0]
        } else {
          this.balance = '0'
        }
      })
    },
    showFlag () {
      this.isShow = !this.isShow
    },
    onConfirm () {
      let accountArr = JSON.parse(this.$common.getStore('account'))
      let data = ''
      let _this = this
      accountArr.map(item => {
        if (item.account === this.wallets[0].account) {
          data = { 'data': item.encryption }
          this.$http.post(`${this.basePath}/v1/login/qrCode/${this.code}`, data).then(res => {
            let responese = res.data
            if (responese.code === 200) {
              _this.show = true
              _this.icon = 'success'
              _this.title = this.$t('index.success')
              _this.buttons[0].type = 'primary'
              _this.buttons[0].text = _this.$t('index.success')
            } else {
              _this.show = true
              _this.icon = 'warn'
              _this.title = this.$t('index.error')
              _this.buttons[0].type = 'warn'
              _this.buttons[0].text = _this.$t('index.error')
            }
          })
        }
      })
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
      this.$router.push(`/?account=${this.wallets[0].account}`)
    }
    this.loadBalance()
  },
  beforeDestroy () {
    this.box && this.box.removeEventListener('scroll', this.handler, false)
  },
  created () {
    this.wallets = this.$common.get_wallets()
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
      isShow: true
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
.balance{
  border-bottom: 1px solid #D9D9D9;
  background-color:#fff;
}
.eye{
  width: 17px;
  height: 15px;
  margin-left: 10px;
}
.balance{
  line-height: 21px;
}
// @header-background-color:#fff
</style>
