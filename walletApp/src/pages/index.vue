<template>
  <div class="index-wrap" v-swipedown="{fn:vuetouchDown}" v-swipeleft="{fn:vuetouchLeft}">
    <div v-transfer-dom>
      <loading v-model="isLoading"></loading>
    </div>
    <div style="padding-top: 8.357143rem;"></div>
    <account-detail></account-detail>
    <sic-cell type="circle" class="fund-manage-wrap align-center" :title="$t('index.SIC')" :value="balance" :link="`/transfer?account=${this.$store.state.account}`"></sic-cell>
    <sic-cell class="align-center" :title="$t('index.backup_wallet')" :value="balance" :link="`/wallet-backup?account=${this.$store.state.account}`">
      <img slot="icon" class="icon" src="../assets/images/ico_backupkey_wallet.png" alt="">
    </sic-cell>
    <!-- <div class="is-backup">
      <cell v-if="isTransfer" class="none-bottom" :title="$t('index.SIC')" :value="balance + '  SIC'" is-link >
        <img slot="icon" class="icon" src="../assets/icon_14.png" width="20" height="22" alt="">
      </cell>
      <cell v-else :title="$t('index.SIC')" :value="balance + '  SIC'" >
        <img slot="icon" class="backup-icon" src="../assets/icon_14.png" width="20" height="22" alt="">
      </cell>
      <cell :title="$t('index.backup_wallet')" is-link >
        <img slot="icon" style="margin-left:-2px" class="backup-icon" src="../assets/icon_11.png" width="24" height="22" alt="">
      </cell>
    </div> -->
     <div v-transfer-dom>
       <toast v-model="httpError" width="60%" type="text" :time="1000" is-show-mask :text="$t('index.http_error')" position="middle">
         <!-- {{ $t('index.http_error')}} -->
       </toast>
    </div>
    <div v-transfer-dom>
      <confirm
      v-model="showUpdateShow"
      :close-on-confirm="false"
      title="版本更新"
      @on-cancel="showUpdateCancel"
      @on-confirm="showUpdateConfirm">
        <ul style="margin:0 2rem">
          <li v-for="item in versionMsg" :key="item" style="text-align:left">{{item}}</li>
        </ul>
      </confirm>
    </div>
    <div v-transfer-dom>
      <loading :show="onLoadingShow" :text="onLoadingText"></loading>
    </div>
  </div>
</template>

<script>
import { Radio, Group, Toast, Cell, Flexbox, FlexboxItem, Badge, Drawer, Confirm, Alert, Msg, Actionsheet, ButtonTab, ButtonTabItem, ViewBox, XHeader, Tabbar, TabbarItem, Loading, TransferDom } from 'vux'
import AppConfig from '../libs/config'
import sicCell from '../components/sicCell'
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
    accountDetail,
    sicCell
  },
  methods: {
    vuetouchDown (s, e) {
      this.isLoading = true
      this.loadBalance()
    },
    vuetouchLeft (s, e) {
      this.$common.go(`/policy?account=this.$route.query.account || this.$store.state.account`, this.$router)
    },
    linkBackup (account) {
      this.$common.go(`/wallet-backup?account=this.$route.query.account || this.$store.state.account`, this.$router)
    },
    loadBalance () {
      let account = this.$route.query.account || this.$store.state.account
      if (account) {
        this.$http.get(`${this.basePath}/v1/chain/accounts/eos/${account}`).then(res => {
          let data = res.data
          this.isLoading = false
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
          this.isLoading = false
          this.httpError = true
          if (!this.$common.getStore('accountInfo')) {
            this.$router.push('/create-account')
          } else {
            this.balance = JSON.parse(this.$common.getStore('accountInfo')).balance.split(' ')[0]
          }
        })
      } else {
        this.isLoading = false
        this.$router.push('/create-account')
      }
    },
    showFlag () {
      this.isShow = !this.isShow
    },
    checkUpdate () {
      // 从服务端获取最新版本
      this.$http.get(`http://sic-client.oss-cn-beijing.aliyuncs.com/version.json?num=${Math.random() * 1000}`).then(data => {
        data = data.data
        this.serverAppVersion = data.version[data.version.length - 1].ver
        this.versionMsg = data.version[data.version.length - 1].msg
        this.AppUpDataUrl = data.version[data.version.length - 1].url
        if (this.isVersions !== this.serverAppVersion && this.$store.state.isUpdate) {
          this.showUpdateShow = true
        }
      })
    },
    /***
     *
     */
    showUpdateConfirm () {
      this.$store.state.isUpdate = false
      window.location.href = this.AppUpDataUrl
    },
    showUpdateCancel () {
      this.$store.state.isUpdate = false
      this.showUpdateShow = false
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
      versionMsg: [],
      code: '',
      path: '/',
      isLoading: true,
      httpError: false,
      direction: 'forward',
      drawerVisibility: false,
      showMode: 'push',
      showModeValue: 'push',
      showPlacement: 'left',
      wallets: [],
      showPlacementValue: 'left',
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
.index-wrap{
  height:100%;overflow:hidden;
}
.fund-manage-wrap{
  margin-top: -2.5rem;
  position: relative;
}
// @header-background-color:#fff
</style>
