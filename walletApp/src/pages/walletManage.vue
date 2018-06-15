<template>
    <div class="page-group">
      <x-header :left-options="{backText: ''}">{{$t('wallet_manage.title')}}</x-header>
      <div style="padding:4.285714rem 0 2.857143rem 0">
        <div class="page clearfix" ref="wallet-manage" id="page-wallet-manage" v-for="(wallet,index) in wallets" :key="index" @click="goDetail(wallet.account)">
          <div class="account-img-wrap">
            <div class="account-img">
              <account-image style="margin-top:0.857143rem;" :account="wallet.account" :size="18"></account-image>
            </div>
            <!-- <account-image :account="wallet.account" :size="28"></account-image> -->
          </div>
          <account-home :account="wallet.account"></account-home>
        </div>
      </div>

      <div class="content-block button-block bom">
        <flexbox>
          <flexbox-item>
            <x-button type="primary" :link="`/create-account?account=${$route.query.account}`">{{$t('wallet_create.index.button_create')}}</x-button>
          </flexbox-item>
          <flexbox-item>
            <x-button :link="`/account-import?account=${$route.query.account}`">{{$t('wallet_create.index.button_import')}}</x-button>
          </flexbox-item>
        </flexbox>
      </div>
    </div>
</template>
<script>
import { XHeader, Group, Cell, Flexbox, FlexboxItem, XButton } from 'vux'
import AccountImage from '../components/AccountImage'
import AccountHome from '../components/AccountHome'
export default {
  components: {
    XHeader,
    Group,
    Cell,
    Flexbox,
    FlexboxItem,
    AccountHome,
    AccountImage,
    XButton
  },
  data () {
    let wallets = this.$common.get_wallets()
    return {
      wallets: wallets,
      balanceArr: []
    }
  },
  methods: {
    loadWallets () {
      if (this.wallets.length === 0) {
        this.$router.replace({
          path: '/create-login'
        })
      } else {
        this.wallets.forEach((wallet, index) => {
          wallet.balance = '0'
          this.loadBalance(wallet, index)
        })
      }
    },
    loadBalance (wallet, index) {
      if (wallet.account) {
        let account = wallet.account
        this.$http.get(`${this.basePath}/v1/chain/accounts/eos/${account}`).then(res => {
          let data = res.data
          if (data.code === 200) {
            this.wallets[index].balance = data.data.eos_balance.split(' ')[0]
          } else {
            this.wallets[index].balance = '0'
          }
        })
      }
    },
    goDetail (account) {
      this.$router.push({path: '/', query: {account: account}})
      this.$store.commit('setAccount', account)
    }
  },
  mounted () {
    this.loadWallets()
  }
}
</script>
<style scoped lang="less">
.page-group{
  background: #efeff4;
  height: 100%;
}
.vux-header{
  position: absolute;
  width: 100%;
  z-index: 9999;
  top:0;
}
.page,
.content {}
.pull-to-refresh-layer {
    .line-scale>div {
        background-color: #3d3d3b;
    }
}
.weui-btn{
  font-weight: 300;
}
.creat-btn{
  background: -webkit-linear-gradient(#3287f1, #3287fd); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(#3287f1, #3287fd); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(#3287f1, #3287fd); /* Firefox 3.6 - 15 */
  background: linear-gradient(#3287f1, #3287fd); /* 标准的语法 */
}
.import-btn{
  color:#1857f2
}
.account-img-wrap{
  text-align: center;
  margin-top: 0.714286rem;
  float: left;
  width: 25%;
}
.clearfix{
  overflow: hidden;
  background: #ffffff;
  margin-top: 0.714286rem;
  padding: 3px 0;
}
.bom {
  padding:0 0.714286rem;
}
.account-img{
  margin-left: 1.428571rem;
  height: 4.5rem;
  text-align: center;
  width: 4.5rem;
  border-radius: 50%;
  border:1px solid #0b4acd;
}
</style>
