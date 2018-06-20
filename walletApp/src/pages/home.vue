<template>
  <div style="height:100%;overflow:hidden">
    <div v-transfer-dom>
      <loading v-model="isLoading"></loading>
    </div>
    <!-- <p class="home-header">{{$t('index.home')}}</p> -->
    <account-detail></account-detail>
    <div class="is-backup">
      <group>
        <cell :title="$t('index.manage_wallets')" is-link :link="`/wallet-manage?account=${this.$store.state.account}`">
          <img slot="icon" class="backup-icon" src="../assets/icon_01-01.jpg" width="22" height="22" alt="">
        </cell>
        <cell class="has-before cell-border-bottom" :title="$t('index.transaction_record')" is-link :link="`/trading-record?account=${this.$store.state.account}`">
          <img slot="icon" class="backup-icon" src="../assets/icon_09.jpg" width="23" height="22" alt="">
        </cell>
        <cell class="cell-border-bottom cell-border-top" style="margin-top:1.428571rem;border-top: 1px solid #e5e5e5;" :title="$t('index.authorization_record')" is-link :link="`/authorization-record?account=${this.$store.state.account}`">
          <img slot="icon" class="backup-icon" src="../assets/icon_icon011.jpg" width="25" height="24" alt="">
          <div class="badge-value" v-if="$store.state.hasMsg">
            <span class="vertical-middle">{{ $t('index.message') }} &nbsp;</span>
            <badge :text="$store.state.msgList.length"></badge>
          </div>
        </cell>
        <cell class="cell-border-top" style="margin-top:1.428571rem;border-top: 1px solid #e5e5e5;" :title="$t('index.agreement')" is-link :link="`/user-agreement`">
          <img slot="icon" class="backup-icon" src="../assets/agreement.jpg" width="24" height="22" alt="">
        </cell>
        <cell v-if="!isIdentity" class="has-before cell-border-bottom" :title="$t('index.identity')" is-link :link="`/identity-authentication?account=${this.$store.state.account}`">
          <img slot="icon" class="backup-icon" src="../assets/auth.png" width="24" height="19" alt="">
        </cell>
        <cell v-else :title="$t('index.identity')" class="has-before cell-border-bottom">
          <img slot="icon" class="backup-icon" src="../assets/auth.png" width="24" height="19" alt="">
          <div>
            <img src="../assets/isidentity.png" width="60" height="25" alt="">
          </div>
        </cell>
        <cell class="cell-border-bottom cell-border-top" style="margin-top:1.428571rem;border-top: 1px solid #e5e5e5;" :title="$t('left_panel.about')" is-link :link="`/about?account=${this.$store.state.account}`">
          <img slot="icon" class="backup-icon" src="../assets/aboutSIC.png" width="25" height="24" alt="">
        </cell>
      </group>
    </div>
  </div>
</template>


<script>
import { XHeader, TransferDom, Loading, Cell, Group, Badge } from 'vux'
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
    Group,
    Badge
  },
  methods: {
    onClickMore () {
      this.showMenu = true
    }
  },
  mounted () {
    if (!this.$route.params.account) {
      this.$router.push(`/home?account=${this.$store.state.account}`)
    }
    this.handler = () => {
      if (this.path === '/') {
        this.box = document.querySelector('#demo_list_box')
        this.updateDemoPosition(this.box.scrollTop)
      }
    }
    this.$store.state.msgList = []
    this.$http.get(`${this.basePath}/v1/msg/user/${this.$store.state.account}?limit=100`, { lowerBound: 0 }).then(res => {
      let data = res.data.data.rows
      data.map(item => {
        if (item.status === 0) {
          this.$store.commit('upDataMsg', true)
          this.$store.commit('upDataMsgList', item)
        }
      })
    })
  },
  beforeDestroy () {
    this.box && this.box.removeEventListener('scroll', this.handler, false)
  },
  created () {
    this.$http.get(`${this.basePath}/v1/chain/accounts/eos/${this.$store.state.account}`).then(res => {
      let data = res.data
      if (data.data.mobile) {
        this.$store.commit('upDataIdentityAccount', this.$store.state.account)
      }
      if (this.$store.state.IdentityAccount.indexOf(this.$store.state.account) > -1) {
        this.isIdentity = true
      } else {
        this.isIdentity = false
      }
    })
  },
  data () {
    return {
      showMenu: false,
      path: '/',
      isLoading: false,
      direction: 'forward',
      drawerVisibility: false,
      showMode: 'push',
      showModeValue: 'push',
      showPlacement: 'left',
      wallets: [],
      showPlacementValue: 'left',
      isIdentity: false
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
.home-header{
  position: absolute;
  z-index: 9999;
  width: 100%;
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
  // border-bottom: 1px solid #e5e5e5;
  background-color: #cccccc1a;
  font-size: 16px;
  color: #333333;
  .weui-cell{
    // border-bottom: 1px solid #e5e5e5;
    background: #ffffff;
  }
  .has-before:before{
    border-top: 1px solid #98b3db!important;
  }
  .cell-border-top{
    border-top:1px solid #d3e1f5!important;
  }
  .cell-border-bottom{
    border-bottom:1px solid #d3e1f5!important;
  }
}
// @header-background-color:#fff
</style>
