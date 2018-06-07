<template>
  <div class="detail" @click="goIndex">
    <img class="background" src="../assets/top_bg.jpg" alt="">
    <div class="account-detail">
      <div class="image-wrap">
        <account-image style="margin-top:7px;" :account="wallet.account" :size="16"></account-image>
      </div>
      <div class="account-info">
        <p class="account-name" style="font-size:15px">{{$t('index.account_name')}}</p>
        <p class="name">
          {{wallet.account}}
          <!-- <img src="../assets/ewm.png"/> -->
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
.image-wrap{
  width: 45px;
  height: 45px;
  text-align: center;
  border-radius: 50%;
  background-color: #ffffff;
  margin:89px 12px 45px 25px;
  float: left;
}
.account-info{
  float: left;
  padding-top: 91px;
  font-size: 21px;
  color: #ffffff;
  p{
    line-height: 1.2
  }
}

.center{
  text-align: center
}

.account-detail{
  // background: url(../../static/top_bg.jpg) no-repeat;
  // background-size: 100% 100%;
  height: 190px;
  z-index: 999;
  position: absolute;
}
.detail{
  position: relative;
  height: 190px;
}
.background{
  position: absolute;
  width: 100%;
  height: 190px;
}
</style>
