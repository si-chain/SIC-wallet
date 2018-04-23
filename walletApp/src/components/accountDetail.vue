<template>
  <div class="detail">
    <div class="account-detail">
      <div class="image-wrap">
        <account-image :account="wallet.account" :size="40"></account-image>
      </div>
      <div class="account-info">
        <p class="name">
          {{wallet.account}}
          <img src="../assets/ewm.png"/>
        </p>
        <div class="is-backup">
          <p v-if="isBackup" @click="linkBackup">{{$t('index.backup_wallet')}} ></p>
        </div>
        <flexbox class="balance">
          <flexbox-item>
            <p class="center" style="position:relative">
              SIC
              <img class="eye" v-if="isShow" @click="show" src="../assets/eyez.png"/>
              <img class="eye" v-else @click="show" src="../assets/eyeb.png"/>
            </p>
          </flexbox-item>
          <flexbox-item></flexbox-item>
          <flexbox-item>
            <p v-if="isShow" class="center">{{balance}}</p>
            <p v-else class="center">******</p>
            </flexbox-item>
        </flexbox>
      </div>
    </div>

  </div>
</template>
<script>
import {Flexbox, FlexboxItem} from 'vux'
import AccountImage from '../components/AccountImage'
export default{
  props: {
    wallet: {
      type: Object,
      default: {}
    }
  },
  components: {
    AccountImage,
    Flexbox,
    FlexboxItem
  },
  data () {
    return {
      balance: '0',
      isBackup: true,
      isShow: true
    }
  },
  created () {
    this.$store.state.wallets.map(item => {
      if (item.account === this.wallet.account && item.isBackUp) {
        this.isBackup = false
      }
    })
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
    },
    show () {
      this.isShow = !this.isShow
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
  padding-top: 20px;
}
.account-info{
  text-align: center;
  font-size: 20px;
  color: #ffffff;
}
.name{
  font-size: 17px;
  line-height: 30px;
  img{
    height: 17px;
    width: 17px;
    margin-left: 20px;
  }
}
.is-backup{
  height: 50px;
  color: red;
  font-size: 15px;
}
.center{
  text-align: center
}
.eye{
  width: 17px;
  height: 15px;
}
.balance{
  line-height: 50px;
}
.account-detail{
  background: -webkit-linear-gradient(white, #244983); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(white, #244983); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(white, #244983); /* Firefox 3.6 - 15 */
  background: linear-gradient(white, #244983); /* 标准的语法 */
}
</style>

