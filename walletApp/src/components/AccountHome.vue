<template>
  <div class="detail">
    <div class="sic">
      <p class="sic-account">{{account}}</p>
      <p>
        <span class="num">{{accountData.balance}}</span>
        <span class="type">SIC</span>
      </p>
    </div>
    <div class="info-content">
      <span class="icon-c"> > </span>
      <span v-if="!accountData.backup" class="backup-date">{{$t('wallet_manage.tip_backup')}}</span>
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
  width: 75%;
  overflow: hidden;
}
.info-content{
  float: left;
  width: 50%;
  line-height: 2rem;
  padding: 21px 0;
  .backup-date{
    font-size: 13px;
    color: #1857f2;
    float: right;
  }
  .icon-c{
    float: right;
    font-size: 18px;
    margin: -2px 20px 0 7px;
    color: #cccccc;
  }
}
.sic-account{
  font-size: 22px;
  color: #333333;
}
.sic{
  line-height: 1.4;
  padding: 16px 0;
  text-align: left;
  float: left;
  width: 50%;
  .num{
    font-size: 14px;
    color: #1857f2;
  }
  .type{
    font-size: 14px;
    color: #999999;
    margin-right: 20px
  }
}
</style>

