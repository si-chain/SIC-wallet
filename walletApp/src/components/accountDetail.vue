<template>
  <div class="detail" @click="goIndex">
    <img v-if="isBackground" class="background" src="../assets/images/bg_wallet.png" alt="">
    <div v-else class="background" :style="{background:BackgroundColor,height:'13.571429rem'}"></div>
    <div class="clearfix" :class="isBackground ? 'default-account-detail' : 'account-detail'">
      <div class="align-center" :class="isBackground ? 'default-image-wrap' : 'image-wrap'">
        <account-image :account="wallet.account"></account-image>
      </div>
      <div class="account-info ">
        <p class="align-center" :class="isBackground ? 'default-account-name' : 'account-name'">{{$t('index.account_name')}}</p>
        <p class="align-center" :class="isBackground ? 'default-name' : 'name'">
          {{wallet.account}}
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import AccountImage from '../components/AccountImage'
export default{
  name: 'account-detail',
  props: {
    isBackground: {
      type: Boolean,
      default: true
    },
    BackgroundColor: {
      type: String,
      default: '#f1f1f1'
    }
  },
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
.default-account-detail{
  position: absolute;
  top: 0;
  width: 100%;
  height: 16.428571rem;
}
.account-detail{
  position: absolute;
  top: 0;
  width: 100%;
  height: 13.571429rem;
}
.default-image-wrap{
  padding: 3.214286rem 0 .714286rem 0;
}
.image-wrap{
  padding: 2.214286rem 0 .714286rem 0;
}
.default-account-name{
  font-size: @font-size4;
  color: rgba(255,255,255,0.5);
}
.account-name{
  font-size: @font-size4;
  color: #a1a1a1;
}
.default-name{
  font-size: @font-size2;
  color: #ffffff;
}
.name{
  font-size: @font-size2;
  color: #000000;
}
</style>
