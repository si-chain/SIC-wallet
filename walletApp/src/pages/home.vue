<template>
  <div style="height:100%;overflow:hidden">
    <div v-transfer-dom>
      <loading v-model="isLoading"></loading>
    </div>
    <p class="header">{{$t('index.home')}}</p>
    <account-detail></account-detail>
    <div class="is-backup">
        <cell :title="$t('index.manage_wallets')" is-link :link="`/wallet-manage?account=${this.$store.state.account}`">
          <img slot="icon" class="backup-icon" src="../assets/icon_01-01.png" width="25" height="25" alt="">
        </cell>
        <cell :title="$t('index.transaction_record')" is-link :link="`/trading-record?account=${this.$store.state.account}`">
          <img slot="icon" class="backup-icon" src="../assets/icon_09.png" width="25" height="25" alt="">
        </cell>
        <cell :title="$t('index.authorization_record')" is-link :link="`/authorization-record?account=${this.$store.state.account}`">
          <img slot="icon" class="backup-icon" src="../assets/icon_icon011.png" width="25" height="25" alt="">
          <div class="badge-value" v-if="$store.state.msgList > 0">
            <span class="vertical-middle">{{ $t('index.message') }} &nbsp;</span>
            <badge :text="$store.state.msgList"></badge>
          </div>
        </cell>
        <cell :title="$t('index.agreement')" is-link :link="`/user-agreement`">
          <img slot="icon" class="backup-icon" src="../assets/agreement.png" width="25" height="25" alt="">
        </cell>
        <cell :title="$t('index.auth')" is-link :link="`/user-agreement`">
          <img slot="icon" class="backup-icon" src="../assets/auth.png" width="25" height="25" alt="">
        </cell>
    </div>
  </div>
</template>

<script>
import { XHeader, TransferDom, Loading, Cell, Badge } from 'vux'
import accountDetail from '../components/accountDetail'
export default {
  name: 'index',
  directives: {
    TransferDom
  },
  components: {
    accountDetail,
    Loading,
    XHeader,
    Cell,
    Badge
  },
  methods: {
    onClickMore () {
      this.showMenu = true
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
.header{
  background-color: #06319a!important;
  color: #ffffff;
  text-align: center;
  line-height: 46px;
  font-size: 18px;
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
  // border-bottom: 1px solid #D9D9D9;
  font-size: 18px;
  color: #333333;
  background-color:#fff;
  .weui-cell{
    border-bottom: 1px solid #D9D9D9;
  }
}
// @header-background-color:#fff
</style>
