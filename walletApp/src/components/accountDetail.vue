<template>
  <div class="detail">
    <div class="account-detail">
      <div class="image-wrap">
        <account-image :account="wallet.account" :size="40"></account-image>
      </div>
      <div class="account-info">
        <p>{{wallet.account}}</p>
        <p @click="linkBackup">{{$t('index.backup_wallet')}} ></p>
        <p>SIC</p>
        <p>{{balance}}</p>
      </div>
    </div>

  </div>
</template>
<script>
import AccountImage from '../components/AccountImage'
export default{
  props: {
    wallet: {
      type: Object,
      default: {}
    }
  },
  components: {
    AccountImage
  },
  data () {
    return {
      balance: '0'
    }
  },
  created () {
    console.log(this.wallet)
  },
  methods: {
    linkBackup (account) {
      let query = {
        account: this.wallet.account
      }
      this.$router.push({path: '/wallet-backup', query})
    },
    loadBalance () {
      let account = this.wallet.account
      this.$http.get(`chain/accounts/eos/${account}`).then(res => {
        let data = res.data
        if (data.code === 200) {
          this.balance = data.data.eos_balance.split(' ')[0]
        } else {
          this.balance = '0'
        }
      })
    }
  },
  mounted () {
    this.loadBalance()
  }
}
</script>
<style lang="less" scoped>
.image-wrap{
  text-align: center;
  padding: 20px 0;
}
.account-info{
  text-align: center;
  font-size: 20px;
  color: #cccccc;
}
.account-detail{
  background: -webkit-linear-gradient(white, blue); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(white, blue); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(white, blue); /* Firefox 3.6 - 15 */
  background: linear-gradient(white, blue); /* 标准的语法 */
}
</style>

