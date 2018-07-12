<template>
    <div class="wallet-manage-wrap">
      <sic-header :left-options="{backText: ''}">{{$t('wallet_manage.title')}}</sic-header>
      <div class="page-group">
        <div class="page" ref="wallet-manage" id="page-wallet-manage" v-for="(wallet,index) in wallets" :key="index" @click="goDetail(wallet.account)">
          <div class="account-img-wrap">
            <div class="account-img">
              <account-image :account="wallet.account" :size="40" wrapSize="4.285714rem"></account-image>
            </div>
          </div>
          <account-home :account="wallet.account"></account-home>
        </div>
      </div>

      <div class="button-wrap button-block">
        <x-button type="primary" :link="`/create-account?account=${$route.query.account}`">{{$t('wallet_create.index.button_create')}}</x-button>
        <x-button type="default" :link="`/account-import?account=${$route.query.account}`">{{$t('wallet_create.index.button_import')}}</x-button>
      </div>
    </div>
</template>
<script>
import { Group, Cell, Flexbox, FlexboxItem, XButton } from 'vux'
import AccountImage from '../components/AccountImage'
import AccountHome from '../components/AccountHome'
import sicHeader from '../components/sicHeader'
export default {
  components: {
    sicHeader,
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
.wallet-manage-wrap{
  position: relative;
}
.page-group{
  // display: flex;
  height: 84%;
  overflow-y: scroll;
}
.page{
  display: flex;
  width: 90%;
  height: 7.142857rem;
  background: #f1f1f1;
  margin: 0 auto;
  margin-top: 1.428571rem;
  border-radius: .357143rem;
}
.page:last-child{
  margin-bottom: 1.428571rem;
}
.account-img-wrap{
  display: flex;
  align-items:center;
}
.account-img{
  flex: 1;
  padding: 0 1.428571rem;
}
.button-wrap{
  position: absolute;
  width: 100%;
  bottom: 0;
  display: flex;
  justify-content: flex-start;
  .weui-btn_primary{
    flex: 3.5
  }
  .weui-btn_default{
    flex: 2
  }
}
.weui-btn + .weui-btn{
  margin-top:0;
}
</style>
