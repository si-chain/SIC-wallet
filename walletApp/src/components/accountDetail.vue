<template>
  <div class="detail" @click="goIndex">
    <img class="background" src="../assets/images/bg_wallet.png" alt="">
    <div class="account-detail clearfix">
      <div class="image-wrap align-center">
        <account-image :account="wallet.account"></account-image>
      </div>
      <div class="account-info ">
        <p class="account-name align-center">{{$t('index.account_name')}}</p>
        <p class="name align-center">
          {{wallet.account}}
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import AccountImage from '../components/AccountImage'
export default{
  components: {
    AccountImage
  },
  data () {
    return {
      wallet: {}
    }
  },
  created () {
    this.wallet.account = this.$store.state.account
    // this.$store.state.wallets.map(item => {
    //   if (item.account === this.wallet.account && item.isBackUp) {
    //     this.isBackup = false
    //   }
    //   item.account === this.$store.state.account ? this.wallet = item : this.wallet = this.$store.state.wallets[0]
    // })
  },
  methods: {
    goIndex () {
      if (this.wallet.account) {
        this.$router.push(`/wallet-backup?account=${this.wallet.account}`)
      } else {
        this.$router.push('/create-account')
      }
    }
  }
}
</script>
<style lang="less" scoped>
.background{
  height: 16.428571rem;
  width: 100%;
}
.detail{
  position: relative;
}
.account-detail{
  position: absolute;
  top: 0;
  width: 100%;
}
.image-wrap{
  padding: 3.214286rem 0 .714286rem 0;
}
.account-name{
  font-size: @font-size4;
  color: rgba(255,255,255,0.5);
}
.name{
  font-size: @font-size2;
  color: #ffffff;
}
</style>
