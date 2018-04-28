<template>
  <div class="detail">
    <!-- <div class="account-img-wrap">
      <account-image :account="account" :size="28"></account-image>
    </div> -->
    <div class="info-content">
      <span style="margin-left: 10px;">{{account}}</span>
      <span class="icon-c"> > </span>
      <span v-if="!accountData.backup" class="backup-date">{{$t('wallet_manage.tip_backup')}}</span>
    </div>
    <p class="sic">
      <span class="num">{{accountData.balance}}</span>
      <span class="type">SIC</span>
    </p>
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
.info-content{
  float: left;
  width: 75%;
  line-height: 2rem;
  font-size: 26px;
  padding-bottom: 10px;
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
    color: #cccccc;
  }
}
.sic{
  text-align: right;
  float: right;
  width: 50%;
  .num{
    font-size: 1.5rem;
    color: #0001fe;
  }
  .type{
    font-size: .9rem;
    color: #333333;
    margin-right: 20px
  }
}
</style>

