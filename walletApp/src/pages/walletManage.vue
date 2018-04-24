<template>
    <div class="page-group">
      <x-header :left-options="{backText: ''}">{{$t('wallet_manage.title')}}</x-header>
        <div class="page clearfix" id="page-wallet-manage" v-for="(wallet,index) in wallets" :key="wallet.account" @click="goDetail(wallet.account)">
          <div class="account-img-wrap">
            <account-image :account="wallet.account" :size="28"></account-image>
          </div>
          <div class="info-content">
            <span style="margin-left: 10px;">{{wallet.account}}</span>
            <span class="icon-c"> > </span>
            <span v-if="!wallet.backup_date" class="backup-date">{{$t('wallet_manage.tip_backup')}}</span>
          </div>
          <p class="sic">
            <span class="num">{{balanceArr[index]}}</span>
            <span class="type">SIC</span>
          </p>
        </div>
    </div>
</template>
<script>
import { XHeader, Group, Cell, Flexbox, FlexboxItem } from 'vux'
import AccountImage from '../components/AccountImage'

export default {
  components: {
    XHeader,
    Group,
    Cell,
    Flexbox,
    FlexboxItem,
    AccountImage
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
          path: this.link('/wallet-create')
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
        this.$http.get(`chain/accounts/eos/${account}`).then(res => {
          let data = res.data
          if (data.code === 200) {
            this.balanceArr[index] = data.data.eos_balance.split(' ')[0]
            console.log(this.balanceArr[index])
          } else {
            this.balanceArr[index] = '0'
          }
        })
      }
    },
    goDetail (account) {
      this.$router.push({path: '/wallet-backup', query: {account: account}})
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
  background-color: #ffffff
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
}
.info-content{
  float: left;
  width: 75%;
  line-height: 4rem;
  font-size: 26px;
  border-bottom: 1px solid #e7e7e7;
  .backup-date{
    font-size: 16px;
    color: #ed3f14;
    font-weight: bold;
    float: right;
  }
  .icon-c{
    float: right;
    margin: 0 20px;
    line-height: 60px;
    color: #cccccc;
  }
}
.sic{
  text-align: right;
  float: left;
  width: 100%;
  .num{
    font-size: 1.5rem;
    font-weight: bold;
    color: #6699ff;
  }
  .type{
    font-size: .7rem;
    color: #cccccc;
    margin-right: 20px
  }
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
