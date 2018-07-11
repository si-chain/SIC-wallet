<template>
  <div class="detail">
    <div class="sic">
      <p class="sic-account">{{account}}</p>
      <p><span class="type">SIC</span></p>
      <p>
        <span class="num">{{accountData.balance}}</span>
      </p>
    </div>
    <div class="info-content">
      <span v-if="!accountData.backup" class="backup-date">
        <img class="wallet-icon" src="../assets/images/ico_backup_wallets.png" alt="">
      </span>
    </div>
  </div>

</template>
<script>
export default{
  props: {
    account: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      accountData: {
        balance: '0',
        backup: false
      }
    }
  },
  created () {
    if (this.account) {
      let account = this.account
      this.$http.get(`${this.basePath}/v1/chain/accounts/eos/${account}`).then(res => {
        let data = res.data
        if (data.code === 200) {
          this.accountData.balance = data.data.eos_balance.split(' ')[0]
        } else {
          this.accountData.balance = '0'
        }
      })
    }
    this.$common.get_wallets().map(item => {
      item.backup_date ? this.accountData.backup = true : this.accountData.backup = false
    })
  }
}
</script>
<style lang="less" scoped>
.detail{
  width: 70%;
  overflow: hidden;
  display: flex;
  align-items: center;
  position: relative;
}
.info-content{
  position: absolute;
  right: 1.428571rem;
}
.sic-account{
  font-size: @font-size3;
  color: #000000;
}
.sic{
  line-height: 1.4;
  padding: 1.142857rem 0;
  text-align: left;
  float: left;
  width: 50%;
  .num{
    font-size: @font-size1;
    color: @index-color;
    font-weight: 600;
  }
  .type{
    font-size: @font-size3;
    color: #666666;
    margin-right: 20px
  }
}
</style>

