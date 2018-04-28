<template>
    <div class="page-group">
      <x-header :left-options="{backText: ''}">{{$t('wallet_manage.title')}}</x-header>
        <div class="page clearfix" id="page-wallet-manage" v-for="(wallet,index) in wallets" :key="index" @click="goDetail(wallet.account)">
          <div class="account-img-wrap">
            <account-image :account="wallet.account" :size="28"></account-image>
          </div>
          <account-home :account="wallet.account"></account-home>
        </div>
         <div class="content-block button-block bom">
          <flexbox>
            <flexbox-item>
              <x-button type="primary" :link="`/create-account?account=${$route.query.account}`">{{$t('wallet_create.index.button_create')}}</x-button>
            </flexbox-item>
            <flexbox-item>
              <x-button type="default" :link="`/account-import?account=${$route.query.account}`">{{$t('wallet_create.index.button_import')}}</x-button>
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
      this.$router.push({path: '/wallet-backup', query: {account: account}})
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
.page,
.content {}
.pull-to-refresh-layer {
    .line-scale>div {
        background-color: #3d3d3b;
    }
}
.account-img-wrap{
  text-align: center;
  margin-top: 10px;
  float: left;
  width: 25%;
}
.clearfix{
  overflow: hidden;
  background: #ffffff;
  margin-top: 10px;
  padding: 10px 0;
}
.bom {
  position: fixed;
  bottom: 1%;
  left: 0%;
  right: 0%;
  padding:0 10px;
}
.wallets {
    margin-top: 0;
    margin-bottom: 3.8rem;
    .wallet-info {
        .item-media {
            padding-bottom: .65rem;
        }
        .item-inner {
            padding-bottom: 1rem;
            padding-top: 1rem;
        }
    }
    ul {
        margin-bottom: .2rem;
        /*background: #f0f5f6;*/
    }
    .price-info {
        .item-after {
            align-items: baseline;
            .price {
                font-size: 1rem;
                font-weight: bold;
            }
        }
    }
}
</style>
