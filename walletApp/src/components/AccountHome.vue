<template>
  <div class="detail">
    <div class="account-home">
      <div class="image-wrap">
        <account-image :account="wallet.account" :size="40"></account-image>
      </div>
      <div class="account-info">
        <flexbox>    
          <flexbox-item>
            <p class="center"  @click="manage">
              
              <img slot="icon"  class="icon" src="../assets/wallet-active.png">
              <p class="label">管理钱包</p>
            </p>  
          </flexbox-item>
           <flexbox-item>
            <p class="center"  @click="deal">
              <img slot="icon"  class="icon" src="../assets/upload-active.png">
              <p class="label">交易记录</p>
            </p>
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
      isShow: true
    }
  },
  created () {
  },
  methods: {
    show () {
      this.isShow = !this.isShow
    },
    manage () {
      let query = {
        account: this.wallet.account
      }
      this.$router.push({path: '/wallet-manage', query})
    },
    deal () {
      let query = {
        account: this.wallet.account
      }
      this.$router.push({path: '/trading-record', query})
    }
  },
  mounted () {
  }
}
</script>
<style lang="less" scoped>
.image-wrap{
  text-align: center;
  padding-top: 40px;
  padding-bottom: 40px;
}
.account-info{
  text-align: center;
  font-size: 20px;
  color: #ffffff;
}
.center{
  text-align: center
}
.icon{
  width: 50px;
  height: 50px;
}
.balance{
  line-height: 100px;
}
.account-home{
  background: -webkit-linear-gradient(white, #244983); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(white, #244983); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(white, #244983); /* Firefox 3.6 - 15 */
  background: linear-gradient(white, #244983); /* 标准的语法 */
}
.label{
    text-align: center;
    font-size: 14px;
    line-height: 30px;
    margin-bottom: 10%;
}
</style>

